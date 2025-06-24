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

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

const createDb = () => {
  if (_db) return _db;

  const sql = neon(getEnvVariable("DATABASE_URL"));

  _db = drizzle({
    client: sql,
    schema,
    cache: upstashCache({
      url: getEnvVariable("UPSTASH_REDIS_REST_URL"),
      token: getEnvVariable("UPSTASH_REDIS_REST_TOKEN"),
      config: { ex: 60 },
    }),
  });

  return _db;
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export const db = new Proxy({} as Database, {
  get: (target, prop) => {
    const actualDb = createDb();
    return actualDb[prop as keyof typeof actualDb];
  },
});
