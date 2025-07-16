import type { MiddlewareHandler } from "hono";
import { withApiKeyAuth, withPrivateApiKeyAuth } from "./auth";
import { withDatabase } from "./db";

/**
 * Public endpoint middleware - only attaches database with smart routing
 * No authentication required
 */
export const publicMiddleware: MiddlewareHandler[] = [withDatabase];

/**
 * Protected endpoint middleware - requires public or private API key authentication
 * Includes database with smart routing and authentication
 * Note: withApiKeyAuth must be first to set session in context
 */
export const protectedPublicApiKeyMiddleware: MiddlewareHandler[] = [
	withDatabase,
	withApiKeyAuth,
];

/**
 * Protected endpoint middleware - requires private API key authentication
 * Includes database with smart routing and authentication
 * Note: withPrivateApiKeyAuth must be first to set session in context
 */
export const protectedPrivateApiKeyMiddleware: MiddlewareHandler[] = [
	withDatabase,
	withPrivateApiKeyAuth,
];
