import { discovery, Configuration, ClientSecretPost } from "openid-client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

let configPromise: Promise<Configuration>;

export const getGoogleConfig = () => {
  if (!configPromise) {
    configPromise = discovery(
      new URL("https://accounts.google.com"),
      process.env.GOOGLE_CLIENT_ID!,
      // Google prefers basic auth with the secret
      undefined,
      ClientSecretPost(process.env.GOOGLE_CLIENT_SECRET)
    );
  }
  return configPromise;
};