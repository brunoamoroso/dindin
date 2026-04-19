import { CookieOptions, NextFunction, Request, Response } from "express";
import { getGoogleConfig } from "../utils/oidc";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
  ResponseBodyError,
} from "openid-client";
import { db } from "../db/conn";
import bcrypt from "bcrypt";
import { createUserToken, generateUserToken } from "../utils/create-user-token";
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

const oauthCookie = process.env.SESSION_COOKIE_NAME || "oauth-state";

const jwtSecret = process.env.ALLIE_JWT_SECRET;

const googleLinkInitType = "google-link-init";

const oAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
  secure: process.env.NODE_ENV === "prod",
};

const getFrontendRedirectUrl = (
  path: string,
  searchParams?: Record<string, string>
) => {
  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    return undefined;
  }

  const redirectUrl = new URL(path, frontendUrl);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      redirectUrl.searchParams.set(key, value);
    });
  }

  return redirectUrl.toString();
};

const redirectGoogleLinkResult = (
  res: Response,
  searchParams: Record<string, string>
) => {
  const redirectTo = getFrontendRedirectUrl("/profile/user", searchParams);

  if (!redirectTo) {
    return res.status(400).json({ message: "FRONTEND_URL not configured" });
  }

  return res.redirect(redirectTo);
};

const createGoogleLinkInitToken = (userId: string) => {
  if (!jwtSecret) {
    throw new jwt.JsonWebTokenError("JWT secret not configured");
  }
  return jwt.sign({ sub: userId, type: googleLinkInitType }, jwtSecret, {
    expiresIn: "5m",
  });
};

const getUserIdFromGoogleLinkInitToken = (token: string) => {
  if (!jwtSecret) {
    throw new jwt.JsonWebTokenError("JWT secret not configured");
  }

  const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

  if (decoded.type !== googleLinkInitType || typeof decoded.sub !== "string") {
    throw new jwt.JsonWebTokenError("Invalid google link init token");
  }

  return decoded.sub;
};

const startGoogleAuthFlow = async (
  res: Response,
  flow: "sign" | "link",
  userId?: string
) => {
  const config = await getGoogleConfig();
  const state = randomState();
  const nonce = randomNonce();
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

  res.cookie(
    oauthCookie,
    JSON.stringify({ state, nonce, codeVerifier, userId }),
    oAuthCookieOptions
  );

  const redirectPath =
    flow === "link" ? "/auth/google/link/callback" : "/auth/google/callback";
  const redirectUri = new URL(redirectPath, process.env.BACKEND_URL).toString();

  const url = buildAuthorizationUrl(config, {
    redirect_uri: redirectUri,
    scope: "openid email profile",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    nonce,
  });

  return res.redirect(url.toString());
};

export const GoogleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return await startGoogleAuthFlow(res, "sign");
  } catch (err) {
    next(err);
  }
};

export const GoogleLinkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: "User Unauthenticated" });
    }

    const redirectTo = new URL("/auth/google/link/start", process.env.BACKEND_URL);
    redirectTo.searchParams.set("token", createGoogleLinkInitToken(String(userId)));

    return res.json({ url: redirectTo.toString() });
  } catch (err) {
    next(err);
  }
};

export const GoogleLinkAuthStart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.query.token;

  if (typeof token !== "string") {
    return redirectGoogleLinkResult(res, { linkError: "invalid" });
  }

  try {
    const userId = getUserIdFromGoogleLinkInitToken(token);
    return await startGoogleAuthFlow(res, "link", userId);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return redirectGoogleLinkResult(res, { linkError: "expired" });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return redirectGoogleLinkResult(res, { linkError: "invalid" });
    }

    next(err);
  }
};

export const GoogleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const redirectUri = new URL("/auth/google/callback", process.env.BACKEND_URL).toString();
    const stored = req.cookies?.[oauthCookie];
    if (!stored) return res.status(400).json({ message: "Missing OAuth state" });

    const { state, nonce, codeVerifier } = JSON.parse(stored);
    const config = await getGoogleConfig();
    const currentUrl = new URL(req.originalUrl, process.env.BACKEND_URL);

    const tokens = await authorizationCodeGrant(config, currentUrl, {
      expectedState: state,
      expectedNonce: nonce,
      pkceCodeVerifier: codeVerifier,
    }, { redirect_uri: redirectUri });

    const claims = tokens.claims(); // from ID token
    const issuer = claims?.iss;
    const issuer_sub = claims?.sub;
    const email = claims?.email;
    const picture = claims?.picture ?? "";
    const givenName = claims?.given_name ?? "";
    const familyName = claims?.family_name ?? "";

    const query = `
      WITH existing AS (
        SELECT u.id
        FROM social_logins sl
        JOIN users u ON u.id = sl.user_id
        WHERE sl.issuer = $1 AND sl.issuer_sub = $2
        LIMIT 1
      ),
      ins_user AS (
        INSERT INTO users (photo, name, surname, username, email)
        SELECT
          $3,
          COALESCE($4, ''),
          COALESCE($5, ''),
          COALESCE($6, ''),
          $7
        WHERE NOT EXISTS (SELECT 1 FROM existing)
        RETURNING id
      ),
      chosen AS (
        SELECT id FROM existing
        UNION ALL
        SELECT id FROM ins_user
      ),
      upsert_sl AS (
        INSERT INTO social_logins (issuer, issuer_sub, user_id, email)
        SELECT $1, $2, id, $7
        FROM chosen
        ON CONFLICT (issuer, issuer_sub)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          email = EXCLUDED.email
        RETURNING user_id
      ),
      upd_user AS (
        UPDATE users
        SET
          name = COALESCE($4, users.name),
          surname = COALESCE($5, users.surname)
        WHERE id = (SELECT user_id FROM upsert_sl LIMIT 1)
        RETURNING id
      )
      SELECT user_id AS id FROM upsert_sl`;

      const username = (String(givenName) + String(familyName))?.replace(/\s+/g, "").toLowerCase() + (Math.floor(Math.random() * 10000)) || "";

      const values = [issuer, issuer_sub, picture, givenName, familyName, username, email];

      const {rows} = await db.query(query, values);
      const userId = rows[0].id;

      res.clearCookie(oauthCookie, oAuthCookieOptions);

      const frontendUrl = process.env.FRONTEND_URL;
      const redirectTo = frontendUrl
        ? new URL("/auth/callback", frontendUrl)
        : undefined;

      if (!redirectTo) {
        return await createUserToken({ id: userId }, req, res);
      }

      const token = generateUserToken({ id: userId });
      redirectTo.hash = new URLSearchParams({ token }).toString();

      return res.redirect(redirectTo.toString());
  } catch (err) {
     if (err instanceof ResponseBodyError) {
    console.error("oauth error", {
      status: err.status,
      error: err.error,
      error_description: err.error_description,
      body: err.cause,
    });
  }
    next(err);
  }
};

export const GoogleLinkAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
    const redirectUri = new URL("/auth/google/link/callback", process.env.BACKEND_URL).toString();
    const stored = req.cookies?.[oauthCookie];
    if (!stored) return redirectGoogleLinkResult(res, { linkError: "invalid" });

    const { state, nonce, codeVerifier, userId } = JSON.parse(stored);
    res.clearCookie(oauthCookie, oAuthCookieOptions);

    if (!userId) {
      return redirectGoogleLinkResult(res, { linkError: "invalid" });
    }

    const config = await getGoogleConfig();
    const currentUrl = new URL(req.originalUrl, process.env.BACKEND_URL);

    const tokens = await authorizationCodeGrant(config, currentUrl, {
      expectedState: state,
      expectedNonce: nonce,
      pkceCodeVerifier: codeVerifier,
    }, { redirect_uri: redirectUri });

    const claims = tokens.claims(); // from ID token
    const issuer = claims?.iss;
    const issuer_sub = claims?.sub;
    const email = claims?.email;

    const existingLoginQuery = `
      SELECT user_id
      FROM social_logins
      WHERE issuer = $1 AND issuer_sub = $2
      LIMIT 1
    `;

    const existingLogin = await db.query(existingLoginQuery, [issuer, issuer_sub]);

    if (existingLogin.rows.length > 0 && existingLogin.rows[0].user_id !== userId) {
      return redirectGoogleLinkResult(res, { linkError: "conflict" });
    }

    const query = `
      INSERT INTO social_logins (issuer, issuer_sub, user_id, email)
      VALUES ($1, $2, (SELECT id FROM users WHERE id = $3), $4)
      ON CONFLICT (issuer, issuer_sub)
      DO UPDATE SET
        email = EXCLUDED.email
      WHERE social_logins.user_id = EXCLUDED.user_id
      RETURNING user_id
    `;

      const values = [issuer, issuer_sub, userId, email];

      const { rows } = await db.query(query, values);

      if (rows.length === 0) {
        return redirectGoogleLinkResult(res, { linkError: "conflict" });
      }

      return redirectGoogleLinkResult(res, { linkedAccount: "true" });
  } catch (err) {
    if (err instanceof ResponseBodyError) {
      console.error("oauth error", {
        status: err.status,
        error: err.error,
        error_description: err.error_description,
        body: err.cause,
      });

      return redirectGoogleLinkResult(res, { linkError: "invalid" });
    }

    next(err);
  }
};

export const GoogleUnlink = async (req: Request, res: Response) => {
  const userId = req.user;

  try {
    const query = `DELETE FROM social_logins WHERE user_id = $1 RETURNING *`;
    const values = [userId];

    const {rows} = await db.query(query, values);

    if(rows.length === 0){
      return res.status(422).json({ message: "Nenhuma conta do Google vinculada encontrada" });
    }

    return res.status(200).json({ message: "Conta do Google desvinculada com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao desvincular conta do Google" });
  }
};

/**
 * username can be username or email
 */
export const SignIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(422)
      .json({ message: "Usuário ou email são obrigatórios" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatória" });
  }

  const querySignIn = `SELECT id, password FROM users WHERE username = $1 OR email = $1 LIMIT 1`;

  const valuesSignIn = [username];

  const {rows} = await db.query(querySignIn, valuesSignIn);
  const user = rows[0];

  if (!user) {
    return res.status(422).json({ message: "Usuário não existe" });
  }

  //check password
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: "Senha inválida" });
  }

  await createUserToken(user, req, res);
};
