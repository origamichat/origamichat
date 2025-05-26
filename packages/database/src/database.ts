import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

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
});

export type Database = typeof db;
