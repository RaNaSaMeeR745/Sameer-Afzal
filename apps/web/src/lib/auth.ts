import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createDb } from "@scoutline/db";
import * as schema from "@scoutline/db";

const databaseUrl = process.env.DATABASE_URL ?? "";
const db = databaseUrl
  ? createDb(databaseUrl)
  : (null as unknown as ReturnType<typeof createDb>);

const socialProviders: {
  google?: { clientId: string; clientSecret: string };
  github?: { clientId: string; clientSecret: string };
} = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

/**
 * Better Auth server instance for Scoutline.
 * Email/password, optional Google and GitHub OAuth (when env is set),
 * TOTP two-factor via plugin. Sessions use secure cookies (nextCookies).
 * Config verified against better-auth.com docs on 2026-10-04.
 * DATABASE_URL, BETTER_AUTH_SECRET, and BETTER_AUTH_URL must be set at runtime.
 */
export const auth = betterAuth({
  appName: "Scoutline",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      twoFactor: schema.twoFactor,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders,
  plugins: [
    twoFactor({
      issuer: "Scoutline",
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
