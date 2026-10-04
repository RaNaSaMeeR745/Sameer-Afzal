import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

/**
 * Browser auth client for Scoutline.
 * twoFactorPage redirects users who must complete TOTP after password sign-in.
 */
export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      twoFactorPage: "/two-factor",
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
