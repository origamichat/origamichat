import type { Database } from "@api/db";
import {
	AuthValidationError,
	type AuthValidationOptions,
	authenticateWithPrivateKey,
	performAuthentication,
} from "@api/lib/auth-validation";
import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { RestContext } from "../types";

// Enable auth logging by setting ENABLE_AUTH_LOGS=true
const AUTH_LOGS_ENABLED = process.env.ENABLE_AUTH_LOGS === "true";

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

function getAuthValidationOptions(
	c: Context<RestContext>
): AuthValidationOptions {
	const origin = c.req.header("Origin");
	let protocol: string | undefined;
	let hostname: string | undefined;

	if (origin) {
		try {
			const url = new URL(origin);
			protocol = url.protocol;
			hostname = url.hostname;
		} catch {
			// Will be handled in validation
		}
	}

	return {
		origin,
		protocol,
		hostname,
	};
}

async function authenticateRequest(c: Context<RestContext>, db: Database) {
	const authHeader = c.req.header("Authorization");
	const privateKey = authHeader?.split(" ")[1];
	const publicKey = c.req.header("X-Public-Key");

	logAuthenticationRequest(c, privateKey, publicKey);

	const options = getAuthValidationOptions(c);

	try {
		const result = await performAuthentication(
			privateKey,
			publicKey,
			db,
			options
		);

		return result.apiKey;
	} catch (error) {
		if (error instanceof AuthValidationError) {
			throw new HTTPException(error.statusCode, { message: error.message });
		}
		throw error;
	}
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

	try {
		const apiKey = await authenticateWithPrivateKey(privateKey, db);

		if (!apiKey) {
			throw new HTTPException(401, { message: "Invalid API key" });
		}

		c.set("apiKey", apiKey);
		c.set("organization", apiKey.organization);
		c.set("website", apiKey.website);

		await next();
	} catch (error) {
		if (error instanceof AuthValidationError) {
			throw new HTTPException(error.statusCode, { message: error.message });
		}
		throw error;
	}
};
