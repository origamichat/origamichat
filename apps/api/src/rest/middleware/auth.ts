import type { Database } from "@api/db";
import {
	type ApiKeyWithWebsiteAndOrganization,
	getApiKeyByKey,
} from "@api/db/queries/api-keys";
import {
	isValidPublicApiKeyFormat,
	isValidSecretApiKeyFormat,
} from "@api/utils/api-keys";

import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { LRUCache } from "lru-cache";
import type { RestContext } from "../types";

// In-memory cache for API keys and users
// Note: This cache is per server instance, and we typically run 1 instance per region.
// Otherwise, we would need to share this state with Redis or a similar external store.
const apiKeyCache = new LRUCache<string, ApiKeyWithWebsiteAndOrganization>({
	max: 5000, // up to 5k entries (adjust based on memory)
	ttl: 1000 * 60 * 30, // 30 minutes in milliseconds
});

async function getApiKeyFromCache(
	key: string,
	db: Database
): Promise<ApiKeyWithWebsiteAndOrganization | null> {
	let apiKey = apiKeyCache.get(key) ?? null;

	if (!apiKey) {
		apiKey = await getApiKeyByKey(db, { key });
		if (apiKey) {
			apiKeyCache.set(key, apiKey);
		}
	}

	return apiKey;
}

function validateDomain(
	requestDomain: string,
	whitelistedDomains: string[]
): boolean {
	return whitelistedDomains.some((domain) => {
		if (domain.startsWith("*.")) {
			const baseDomain = domain.slice(2);
			return (
				requestDomain === baseDomain || requestDomain.endsWith(`.${baseDomain}`)
			);
		}
		return requestDomain === domain;
	});
}

function validateOriginForPublicKey(
	c: Context<RestContext>,
	apiKey: ApiKeyWithWebsiteAndOrganization
): void {
	if (!apiKey.website) {
		return;
	}

	// Origin header is more reliable than Referer for CORS-like validation
	const origin = c.req.header("Origin");

	if (!origin) {
		// For public API keys, we require Origin header to be present
		// This provides some protection against non-browser requests
		throw new HTTPException(403, {
			message:
				"Origin header is required for public key authentication. This API key can only be used from browser environments.",
		});
	}

	// Handle special case of null origin (file://, data:, etc.)
	if (origin === "null") {
		throw new HTTPException(403, {
			message:
				"Requests from null origin are not allowed for public key authentication",
		});
	}

	let requestDomain: string;
	try {
		const url = new URL(origin);
		requestDomain = url.hostname;

		// Additional validation: reject non-standard schemes
		if (!["http:", "https:"].includes(url.protocol)) {
			throw new HTTPException(403, {
				message: "Only HTTP and HTTPS origins are allowed",
			});
		}
	} catch {
		throw new HTTPException(403, { message: "Invalid origin header format" });
	}

	const isWhitelisted = validateDomain(
		requestDomain,
		apiKey.website.whitelistedDomains
	);

	if (!isWhitelisted) {
		throw new HTTPException(403, {
			message: `Domain ${requestDomain} is not whitelisted for this API key`,
		});
	}

	// Additional security: Log suspicious requests for monitoring
	// This helps detect potential spoofing attempts
	if (process.env.NODE_ENV === "production") {
		console.log(
			`Public key used from origin: ${origin}, domain: ${requestDomain}`
		);
	}
}

async function authenticateWithPrivateKey(
	privateKey: string,
	db: Database
): Promise<ApiKeyWithWebsiteAndOrganization | null> {
	if (!isValidSecretApiKeyFormat(privateKey)) {
		throw new HTTPException(401, {
			message: "Invalid private API key format",
		});
	}

	return await getApiKeyFromCache(privateKey, db);
}

async function authenticateWithPublicKey(
	publicKey: string,
	db: Database,
	c: Context<RestContext>
): Promise<ApiKeyWithWebsiteAndOrganization | null> {
	if (!isValidPublicApiKeyFormat(publicKey)) {
		throw new HTTPException(401, {
			message: "Invalid public API key format",
		});
	}

	const apiKey = await getApiKeyFromCache(publicKey, db);

	if (apiKey) {
		validateOriginForPublicKey(c, apiKey);
	}

	return apiKey;
}

export const withApiKeyAuth: MiddlewareHandler = async (c, next) => {
	const authHeader = c.req.header("Authorization");
	const privateKey = authHeader?.split(" ")[1];
	const publicKey = c.req.header("X-Public-Key");
	const db = c.get("db");

	let apiKey: ApiKeyWithWebsiteAndOrganization | null = null;

	if (privateKey) {
		apiKey = await authenticateWithPrivateKey(privateKey, db);
	} else if (publicKey) {
		apiKey = await authenticateWithPublicKey(publicKey, db, c);
	} else {
		throw new HTTPException(401, { message: "API key is required" });
	}

	if (!apiKey) {
		throw new HTTPException(401, { message: "Invalid API key" });
	}

	c.set("apiKey", apiKey);
	c.set("organization", apiKey.organization);
	c.set("website", apiKey.website);

	await next();
};

export const withPrivateApiKeyAuth: MiddlewareHandler = async (c, next) => {
	const authHeader = c.req.header("Authorization");
	const privateKey = authHeader?.split(" ")[1];
	const db = c.get("db");

	if (!privateKey) {
		throw new HTTPException(401, { message: "API key is required" });
	}

	const apiKey = await authenticateWithPrivateKey(privateKey, db);

	if (!apiKey) {
		throw new HTTPException(401, { message: "Invalid API key" });
	}

	c.set("apiKey", apiKey);
	c.set("organization", apiKey.organization);
	c.set("website", apiKey.website);

	await next();
};
