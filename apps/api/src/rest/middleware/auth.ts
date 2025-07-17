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

// Enable auth logging by setting ENABLE_AUTH_LOGS=true
const AUTH_LOGS_ENABLED = process.env.ENABLE_AUTH_LOGS === "true";

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
		let domainToCheck = domain;

		// Handle full URLs by extracting hostname
		if (domain.includes("://")) {
			try {
				const url = new URL(domain);
				domainToCheck = url.hostname;
			} catch {
				// If URL parsing fails, use the domain as-is
				domainToCheck = domain;
			}
		}

		if (AUTH_LOGS_ENABLED) {
			console.log(
				`[AUTH] Checking domain: "${requestDomain}" against "${domainToCheck}" (original: "${domain}")`
			);
		}

		if (domainToCheck.startsWith("*.")) {
			const baseDomain = domainToCheck.slice(2);
			const isMatch =
				requestDomain === baseDomain ||
				requestDomain.endsWith(`.${baseDomain}`);
			if (AUTH_LOGS_ENABLED) {
				console.log(`[AUTH] Wildcard match for "${baseDomain}": ${isMatch}`);
			}
			return isMatch;
		}

		const isMatch = requestDomain === domainToCheck;
		if (AUTH_LOGS_ENABLED) {
			console.log(`[AUTH] Exact match: ${isMatch}`);
		}
		return isMatch;
	});
}

function validateOriginHeader(origin: string | undefined): string {
	if (!origin) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Origin header missing");
		}
		throw new HTTPException(403, {
			message:
				"Origin header is required for public key authentication. This API key can only be used from browser environments.",
		});
	}

	if (origin === "null") {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Null origin detected");
		}
		throw new HTTPException(403, {
			message:
				"Requests from null origin are not allowed for public key authentication",
		});
	}

	return origin;
}

function parseAndValidateOriginUrl(origin: string): string {
	let requestDomain: string;
	try {
		const url = new URL(origin);
		requestDomain = url.hostname;

		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Parsed origin:", {
				protocol: url.protocol,
				hostname: url.hostname,
				port: url.port,
			});
		}

		if (!["http:", "https:"].includes(url.protocol)) {
			if (AUTH_LOGS_ENABLED) {
				console.log("[AUTH] Invalid protocol:", url.protocol);
			}
			throw new HTTPException(403, {
				message: "Only HTTP and HTTPS origins are allowed",
			});
		}
	} catch (error) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Failed to parse origin:", error);
		}
		throw new HTTPException(403, { message: "Invalid origin header format" });
	}

	return requestDomain;
}

function validateOriginForPublicKey(
	c: Context<RestContext>,
	apiKey: ApiKeyWithWebsiteAndOrganization
): void {
	if (!apiKey.website) {
		if (AUTH_LOGS_ENABLED) {
			console.log(
				"[AUTH] No website associated with API key, skipping origin validation"
			);
		}
		return;
	}

	const origin = c.req.header("Origin");

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Origin validation:", {
			origin,
			websiteId: apiKey.website.id,
			whitelistedDomains: apiKey.website.whitelistedDomains,
		});
	}

	const validatedOrigin = validateOriginHeader(origin);
	const requestDomain = parseAndValidateOriginUrl(validatedOrigin);

	const isWhitelisted = validateDomain(
		requestDomain,
		apiKey.website.whitelistedDomains
	);

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Domain validation:", {
			requestDomain,
			whitelistedDomains: apiKey.website.whitelistedDomains,
			isWhitelisted,
		});
	}

	if (!isWhitelisted) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Domain not whitelisted:", {
				requestDomain,
				whitelistedDomains: apiKey.website.whitelistedDomains,
			});
		}
		throw new HTTPException(403, {
			message: `Domain ${requestDomain} is not whitelisted for this API key`,
		});
	}

	// Additional security: Log suspicious requests for monitoring
	if (process.env.NODE_ENV === "production" && !AUTH_LOGS_ENABLED) {
		console.log(
			`Public key used from origin: ${validatedOrigin}, domain: ${requestDomain}`
		);
	}

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Origin validation successful");
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
	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Validating public key format:", {
			publicKey: `${publicKey.substring(0, 10)}...`,
			isValid: isValidPublicApiKeyFormat(publicKey),
		});
	}

	if (!isValidPublicApiKeyFormat(publicKey)) {
		throw new HTTPException(401, {
			message: "Invalid public API key format",
		});
	}

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Looking up API key in database/cache");
	}

	const apiKey = await getApiKeyFromCache(publicKey, db);

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] API key lookup result:", {
			found: !!apiKey,
			apiKeyId: apiKey?.id,
			websiteId: apiKey?.website?.id,
			organizationId: apiKey?.organization?.id,
		});
	}

	if (apiKey) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Validating origin for public key");
		}
		validateOriginForPublicKey(c, apiKey);
	}

	return apiKey;
}

function logAuthenticationRequest(
	c: Context<RestContext>,
	privateKey: string | undefined,
	publicKey: string | undefined
): void {
	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Processing request:", {
			url: c.req.url,
			method: c.req.method,
			hasPrivateKey: !!privateKey,
			hasPublicKey: !!publicKey,
			publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : null,
			origin: c.req.header("Origin"),
			referer: c.req.header("Referer"),
		});
	}
}

async function performAuthentication(
	privateKey: string | undefined,
	publicKey: string | undefined,
	db: Database,
	c: Context<RestContext>
): Promise<ApiKeyWithWebsiteAndOrganization | null> {
	if (privateKey) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Using private key authentication");
		}
		return await authenticateWithPrivateKey(privateKey, db);
	}

	if (publicKey) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] Using public key authentication");
		}
		return await authenticateWithPublicKey(publicKey, db, c);
	}

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] No API key provided");
	}
	throw new HTTPException(401, { message: "API key is required" });
}

async function authenticateRequest(
	c: Context<RestContext>,
	db: Database
): Promise<ApiKeyWithWebsiteAndOrganization> {
	const authHeader = c.req.header("Authorization");
	const privateKey = authHeader?.split(" ")[1];
	const publicKey = c.req.header("X-Public-Key");

	logAuthenticationRequest(c, privateKey, publicKey);

	const apiKey = await performAuthentication(privateKey, publicKey, db, c);

	if (!apiKey) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[AUTH] API key not found in database");
		}
		throw new HTTPException(401, { message: "Invalid API key" });
	}

	if (AUTH_LOGS_ENABLED) {
		console.log("[AUTH] Authentication successful:", {
			apiKeyId: apiKey.id,
			organizationId: apiKey.organization.id,
			websiteId: apiKey.website?.id,
			websiteName: apiKey.website?.name,
			whitelistedDomains: apiKey.website?.whitelistedDomains,
		});
	}

	return apiKey;
}

export const withApiKeyAuth: MiddlewareHandler = async (c, next) => {
	const db = c.get("db");
	const apiKey = await authenticateRequest(c, db);

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
