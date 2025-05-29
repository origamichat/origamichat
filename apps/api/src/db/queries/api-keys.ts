import type { Database } from "@repo/database";
import { apiKey } from "@repo/database";
import { and, eq } from "drizzle-orm";

export async function getApiKeyByKey(db: Database, key: string) {
  const result = await db.query.apiKey.findFirst({
    where: and(eq(apiKey.key, key), eq(apiKey.isActive, true)),
    with: {
      organization: true,
      website: true,
    },
  });

  return result;
}

export async function createApiKey(
  db: Database,
  data: {
    key: string;
    name?: string;
    organizationId: string;
    websiteId: string;
    keyType: "private" | "public";
    createdBy: string;
    isTest: boolean;
    expiresAt?: Date;
  }
) {
  const [result] = await db
    .insert(apiKey)
    .values({
      key: data.key,
      organizationId: data.organizationId,
      keyType: data.keyType,
      createdBy: data.createdBy,
      websiteId: data.websiteId,
      isActive: true,
      isTest: data.isTest,
      expiresAt: data.expiresAt,
    })
    .returning();

  return result;
}
