import { env } from "@api/env";
import { RedisStore } from "@hono-rate-limiter/redis";
import { Redis } from "@upstash/redis";
import type { Context } from "hono";
import { rateLimiter } from "hono-rate-limiter";

const redis = new Redis({
	url: env.UPSTASH_REDIS_REST_URL,
	token: env.UPSTASH_REDIS_REST_TOKEN,
});

const store = new RedisStore({
	client: redis,
	prefix: "cossistant:rate-limit:",
});

export const createRateLimiter = (options: {
	windowMs: number;
	limit: number;
	keyGenerator?: (c: Context) => string;
	message?: string;
}) => {
	return rateLimiter({
		windowMs: options.windowMs,
		limit: options.limit,
		standardHeaders: "draft-6",
		keyGenerator:
			options.keyGenerator ||
			((c) => {
				return (
					c.req.header("x-forwarded-for") ||
					c.req.header("x-real-ip") ||
					c.req.header("cf-connecting-ip") ||
					"anonymous"
				);
			}),
		store,
		message: options.message || "Too many requests, please try again later.",
	});
};

export const strictRateLimiter = createRateLimiter({
	windowMs: 60 * 1000, // 1 minute
	limit: 3, // 3 requests per minute
	message: "Too many requests, please try again in a minute.",
});

export const moderateRateLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // 10 requests per 15 minutes
	message: "Too many requests, please try again later.",
});

export const emailBasedRateLimiter = (windowMs: number, limit: number) => {
	return createRateLimiter({
		windowMs,
		limit,
		keyGenerator: (c) => {
			// For email-based endpoints, use email as key
			const email = c.req.param("email");
			return email || "anonymous";
		},
		message: "Too many requests for this email, please try again later.",
	});
};
