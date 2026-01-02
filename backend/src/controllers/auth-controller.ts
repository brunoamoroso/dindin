import { NextFunction, Request, Response } from "express";
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
import { createUserToken } from "../utils/create-user-token";

const oauthCookie = process.env.SESSION_COOKIE_NAME || "oauth-state";
const redirectUri = `${process.env.BACKEND_URL}/auth/google/callback`;

export const GoogleAuth = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await getGoogleConfig();
    const state = randomState();
    const nonce = randomNonce();
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);

    res.cookie(oauthCookie, JSON.stringify({ state, nonce, codeVerifier }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "prod",
    });

    const url = buildAuthorizationUrl(config, {
      redirect_uri: redirectUri,
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state,
      nonce,
    });

    res.redirect(url.toString());
  } catch (err) {
    next(err);
  }
};

export const GoogleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

      res.clearCookie(oauthCookie);

      const frontendUrl = process.env.FRONTEND_URL;
      const redirectTo = frontendUrl
        ? new URL("/dashboard", frontendUrl).toString()
        : undefined;

      await createUserToken({ id: userId }, req, res, { redirectTo });
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
