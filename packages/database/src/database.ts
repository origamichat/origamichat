import "dotenv/config";

import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const getEnvVariable = (name: string): string => {
  const value = process.env[name];

  if (value == null) throw new Error(`environment variable ${name} not found`);

  return value;
};

export const db = drizzle(getEnvVariable("DATABASE_URL"), {
  schema,
  mode: "default",
});
