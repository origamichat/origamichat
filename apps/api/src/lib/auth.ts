import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@repo/database";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8787",
  secret: process.env.BETTER_AUTH_SECRET || undefined,
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
  // Allow requests from the frontend development server
  trustedOrigins: [
    "http://localhost:3000",
    "https://origami.chat",
    "https://origamichat.com",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  session: {
    // Cache the session in the cookie for 5 minutes
    // This is to avoid hitting the database for each request
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export type AuthType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
