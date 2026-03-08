import { createAuthClient } from "better-auth/react";
import { appConfig } from "@/configs";

export const authClient = createAuthClient({
  baseURL: appConfig.publicBetterAuthUrl,
});

export const { signIn, signUp, signOut, useSession } = authClient;
