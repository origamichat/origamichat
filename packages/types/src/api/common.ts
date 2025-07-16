import { z } from "@hono/zod-openapi";

/**
 * Common validation schemas used across multiple API endpoints
 */

/**
 * Email validation schema
 */
export const emailSchema = z.string().email().openapi({
	description: "A valid email address.",
	example: "user@example.com",
});

/**
 * User ID validation schema
 */
export const userIdSchema = z.string().ulid().openapi({
	description: "A valid user identifier.",
	example: "01JG000000000000000000000",
});

/**
 * Optional user ID validation schema
 */
export const optionalUserIdSchema = z.string().ulid().optional().openapi({
	description: "An optional user identifier.",
	example: "01JG000000000000000000000",
});

/**
 * Referral code validation schema
 */
export const referralCodeSchema = z.string().min(1).openapi({
	description: "A referral code for accessing features.",
	example: "WELCOME2024",
});

/**
 * Common pagination schema
 */
export const paginationSchema = z.object({
	page: z.number().int().positive().default(1).openapi({
		description: "The page number to retrieve.",
		example: 1,
	}),
	limit: z.number().int().positive().max(100).default(20).openapi({
		description: "The number of items per page (max 100).",
		example: 20,
	}),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Pagination response schema
 */
export const paginationResponseSchema = z.object({
	page: z.number().int().positive().openapi({
		description: "The current page number.",
		example: 1,
	}),
	limit: z.number().int().positive().openapi({
		description: "The number of items per page.",
		example: 20,
	}),
	total: z.number().int().nonnegative().openapi({
		description: "The total number of items.",
		example: 100,
	}),
	hasMore: z.boolean().openapi({
		description: "Whether there are more items available.",
		example: true,
	}),
});

export type PaginationResponse = z.infer<typeof paginationResponseSchema>;
