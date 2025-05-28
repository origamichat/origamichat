import { sql } from "drizzle-orm";
import { db } from "@repo/database";

export async function checkHealth() {
  await db.execute(sql`SELECT 1`);
}
