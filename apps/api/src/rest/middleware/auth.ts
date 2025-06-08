import { getApiKeyByKey } from "@/db/queries/api-keys";
import { isValidSecretApiKeyFormat } from "@/utils/api-keys";
import {
  ApiKeySelect,
  OrganizationSelect,
  WebsiteSelect,
} from "@repo/database";
import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { LRUCache } from "lru-cache";

type ApiKeyWithWebsiteAndOrganization = ApiKeySelect & {
  website: WebsiteSelect;
  organization: OrganizationSelect;
};

// In-memory cache for API keys and users
// Note: This cache is per server instance, and we typically run 1 instance per region.
// Otherwise, we would need to share this state with Redis or a similar external store.
const apiKeyCache = new LRUCache<string, ApiKeyWithWebsiteAndOrganization>({
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

  c.set("apiKey", apiKey);
  c.set("organization", apiKey.organization);
  c.set("website", apiKey.website);

  await next();
};
