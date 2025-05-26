import type { Database } from "@repo/database";
import { apiKey } from "@repo/database";
import { and, eq } from "drizzle-orm";

export async function getApiKeyByKey(db: Database, key: string) {
  const [result] = await db
    .select()
    .from(apiKey)
    .where(and(eq(apiKey.key, key), eq(apiKey.isActive, true)))
    .limit(1);

  return result;
}

export async function createApiKey(
  db: Database,
  data: {
    key: string;
    name?: string;
    organizationId: string;
    keyType: "private" | "public";
    createdBy: string;
    isTest: boolean;
    expiresAt?: Date;
  }
) {
  const [result] = await db.insert(apiKey).values({
    id: "",
    key: data.key,
    organizationId: data.organizationId,
    keyType: data.keyType,
    createdBy: data.createdBy,
    isActive: true,
    isTest: data.isTest,
    expiresAt: data.expiresAt,
  });

  return result;
}
