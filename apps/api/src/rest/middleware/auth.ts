import { getApiKeyByKey } from "@/db/queries/api-keys";
import { getOrganizationById } from "@/db/queries/organization";
import { isValidSecretApiKeyFormat } from "@/utils/api-keys";
import { ApiKeySelect, OrganizationSelect } from "@repo/database";
import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { LRUCache } from "lru-cache";

// In-memory cache for API keys and users
// Note: This cache is per server instance, and we typically run 1 instance per region.
// Otherwise, we would need to share this state with Redis or a similar external store.
const apiKeyCache = new LRUCache<string, ApiKeySelect>({
  max: 5_000, // up to 5k entries (adjust based on memory)
  ttl: 1000 * 60 * 30, // 30 minutes in milliseconds
});

const organizationCache = new LRUCache<string, OrganizationSelect>({
  max: 5_000, // up to 5k entries (adjust based on memory)
  ttl: 1000 * 60 * 30, // 30 minutes in milliseconds
});

export const withPublicApiKeyAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (token && !isValidSecretApiKeyFormat(token)) {
    throw new HTTPException(401, { message: "Invalid public API key format" });
  }

  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const db = c.get("db");

  // Check cache first for API key
  let apiKey = apiKeyCache.get(token);

  if (!apiKey) {
    // If not in cache, query database
    apiKey = await getApiKeyByKey(db, token);

    if (apiKey) {
      // Store in cache for future requests
      apiKeyCache.set(token, apiKey);
    }
  }

  if (!apiKey) {
    throw new HTTPException(401, { message: "Invalid API key" });
  }

  // Check cache first for user
  const organizationCacheKey = `organization_${apiKey.organizationId}`;

  let organization = organizationCache.get(organizationCacheKey);

  if (!organization) {
    // If not in cache, query database
    organization = await getOrganizationById(db, apiKey.organizationId);

    if (organization) {
      // Store in cache for future requests
      organizationCache.set(organizationCacheKey, organization);
    }
  }

  if (!organization) {
    throw new HTTPException(401, { message: "Organization not found" });
  }

  const session = {
    organization,
    apiKey,
  };

  c.set("session", session);
  c.set("organizationId", session.organization.id);

  await next();
};
