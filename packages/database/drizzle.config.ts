import "dotenv/config";

import type { Config } from "drizzle-kit";

const getEnvVariable = (name: string) => {
  const value = process.env[name];
  if (value == null) throw new Error(`environment variable ${name} not found`);
  return value;
};

export default {
  schema: "./src/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: getEnvVariable("DATABASE_URL"),
  },
} satisfies Config;
