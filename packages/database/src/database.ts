import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { upstashCache } from "drizzle-orm/cache/upstash";

import * as schema from "./schema";

const getEnvVariable = (name: string): string => {
  const value = process.env[name];

  // During build time, environment variables might not be available
  // Check if we're in a build environment and handle gracefully
  if (value == null) {
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV) {
      // This is likely a build environment, return a placeholder
      console.warn(
        `Warning: Environment variable ${name} not found during build`
      );
      return "build-time-placeholder";
    }
    throw new Error(`environment variable ${name} not found`);
  }

  return value;
};

const isBuildTime = (): boolean => {
  // Detect if we're in a build environment
  return (
    (process.env.NODE_ENV === "production" &&
      !process.env.VERCEL_ENV &&
      !process.env.DATABASE_URL) ||
    process.env.NEXT_PHASE === "phase-production-build"
  );
};

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

const createDb = () => {
  if (_db) return _db;

  // If we're in build time, return a mock database
  if (isBuildTime()) {
    console.warn("Warning: Database not initialized during build time");
    // Return a proxy that throws runtime errors for actual usage
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get: () => {
        throw new Error("Database is not available during build time");
      },
    });
  }

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
