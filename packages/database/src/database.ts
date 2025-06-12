import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { upstashCache } from "drizzle-orm/cache/upstash";

import * as schema from "./schema";

const getEnvVariable = (name: string): string => {
  const value = process.env[name];

  if (value == null) throw new Error(`environment variable ${name} not found`);

  return value;
};

const sql = neon(getEnvVariable("DATABASE_URL"));

export const db = drizzle({
  client: sql,
  schema,
  cache: upstashCache({
    // 👇 Redis credentials (optional — can also be pulled from env vars)
    url: "<UPSTASH_URL>",
    token: "<UPSTASH_TOKEN>",
    // 👇 Default cache behavior (optional)
    config: { ex: 60 },
  }),
});

export type Database = typeof db;
