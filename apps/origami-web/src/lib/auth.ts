import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@repo/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
  }),
});
