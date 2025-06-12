import { env } from "@api/env";
import { generateApiKey, hashApiKey } from "@api/utils/api-keys";
import type {
  ApiKeySelect,
  Database,
  OrganizationSelect,
  WebsiteSelect,
} from "@repo/database";
import { apiKey, APIKeyType } from "@repo/database";
import { and, eq } from "drizzle-orm";

export type CreateApiKeyResult = ApiKeySelect;

export type ApiKeyWithWebsiteAndOrganization = ApiKeySelect & {
  website: WebsiteSelect;
  organization: OrganizationSelect;
};

export async function getApiKeyByKey(
  db: Database,
  key: string
): Promise<ApiKeyWithWebsiteAndOrganization | undefined> {
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
    name: string;
    organizationId: string;
    websiteId: string;
    keyType: APIKeyType;
    createdBy: string;
    isTest: boolean;
  }
): Promise<CreateApiKeyResult> {
  let storedKey = "";

  // Generate key
  const rawKey = generateApiKey({
    type: data.keyType,
    isTest: data.isTest,
  });

  // Hash the key using a secret from the environment
  if (data.keyType === APIKeyType.PRIVATE) {
    storedKey = hashApiKey(rawKey, env.API_KEY_SECRET);
  } else {
    storedKey = rawKey;
  }

  // Save hashed key in database
  const [result] = await db
    .insert(apiKey)
    .values({
      name: data.name,
      key: storedKey,
      organizationId: data.organizationId,
      keyType: data.keyType,
      createdBy: data.createdBy,
      websiteId: data.websiteId,
      isActive: true,
      isTest: data.isTest,
    })
    .returning();

  // Return the raw key to the caller (not stored)
  return { ...result, key: rawKey };
}

export async function createDefaultWebsiteKeys(
  db: Database,
  data: {
    websiteId: string;
    websiteName: string;
    organizationId: string;
    createdBy: string;
  }
) {
  // Generate production / test private and public keys
  const keys = [
    {
      name: `${data.websiteName} - Private API Key`,
      keyType: APIKeyType.PRIVATE,
      isActive: true,
      isTest: false,
    },
    {
      name: `${data.websiteName} - Public API Key`,
      keyType: APIKeyType.PUBLIC,
      isActive: true,
      isTest: false,
    },
    {
      name: `${data.websiteName} - Test Private API Key`,
      keyType: APIKeyType.PRIVATE,
      isActive: true,
      isTest: true,
    },
    {
      name: `${data.websiteName} - Test Public API Key`,
      keyType: APIKeyType.PUBLIC,
      isActive: true,
      isTest: true,
    },
  ];

  const result = await Promise.all(
    keys.map((key) =>
      createApiKey(db, {
        ...key,
        ...data,
      })
    )
  );

  return result;
}
