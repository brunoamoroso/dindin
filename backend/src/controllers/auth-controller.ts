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

const oauthCookie = process.env.SESSION_COOKIE_NAME || "oauth-state";

const oAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
  secure: process.env.NODE_ENV === "prod",
}

export const GoogleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const flow = req.path.endsWith("/link") ? "link" : "sign";
    const userId = req.user;
    const config = await getGoogleConfig();
    const state = randomState();
    const nonce = randomNonce();
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

    res.cookie(oauthCookie, JSON.stringify({ state, nonce, codeVerifier, userId }), oAuthCookieOptions);

    let redirectUri;

    if (flow === "link") {
      redirectUri = new URL("/auth/google/link/callback", process.env.BACKEND_URL).toString();
    } else {
      redirectUri = new URL("/auth/google/callback", process.env.BACKEND_URL).toString();
    }

    const url = buildAuthorizationUrl(config, {
      redirect_uri: redirectUri,
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
      nonce,
    });

    if(flow === "link"){
      return res.json({url: url.toString()});
    }

    res.redirect(url.toString());
  } catch (err) {
    next(err);
  }
}

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
    if (!stored) return res.status(400).json({ message: "Missing OAuth state" });

    const { state, nonce, codeVerifier, userId } = JSON.parse(stored);
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

    const query = `
      INSERT INTO social_logins (issuer, issuer_sub, user_id, email)
      VALUES ($1, $2, (SELECT id FROM users WHERE id = $3), $4)
      ON CONFLICT (issuer, issuer_sub)
      DO UPDATE SET
        user_id = EXCLUDED.user_id,
        email = EXCLUDED.email
      RETURNING user_id
    `;

      const values = [issuer, issuer_sub, userId, email];

      await db.query(query, values);

      res.clearCookie(oauthCookie, oAuthCookieOptions);

      const frontendUrl = process.env.FRONTEND_URL;
      const redirectTo = frontendUrl
        ? new URL("/profile/user?linkedAccount=true", frontendUrl).toString()
        : undefined;
        
      res.redirect(redirectTo!);
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
