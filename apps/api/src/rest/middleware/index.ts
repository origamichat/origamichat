import type { MiddlewareHandler } from "hono";
import { withPublicApiKeyAuth } from "./auth";
import { withDatabase } from "./db";

/**
 * Public endpoint middleware - only attaches database with smart routing
 * No authentication required
 */
export const publicMiddleware: MiddlewareHandler[] = [withDatabase];

/**
 * Protected endpoint middleware - requires public API key authentication
 * Includes database with smart routing and authentication
 * Note: withPublicApiKeyAuth must be first to set session in context
 */
export const protectedMiddleware: MiddlewareHandler[] = [
	withDatabase,
	withPublicApiKeyAuth,
];
