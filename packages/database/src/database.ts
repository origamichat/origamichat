import "dotenv/config";

import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

import type * as schema from "./schema";

const getEnvVariable = (name: string): string => {
  const value = process.env[name];

  if (value == null) {
    console.error(`Environment variable ${name} not found`);
    throw new Error(`environment variable ${name} not found`);
  }
  return value;
};

let _db: NodePgDatabase<typeof schema> | null = null;

const createDb = (): NodePgDatabase<typeof schema> => {
  if (_db) {
    return _db;
  }

  _db = drizzle({
    connection: {
      connectionString: getEnvVariable("DATABASE_URL"),
      ssl: getEnvVariable("NODE_ENV") === "production",
    },
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
