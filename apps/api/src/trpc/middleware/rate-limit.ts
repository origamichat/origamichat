import { env } from "@api/env";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { TRPCContext } from "../init";

const redis = new Redis({
	url: env.UPSTASH_REDIS_REST_URL,
	token: env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
	analytics: true,
	prefix: "@cossistant/trpc",
});

export const withRateLimitMiddleware = async (opts: {
	ctx: TRPCContext;
	// biome-ignore lint/suspicious/noExplicitAny: ok here
	next: () => Promise<any>;
}) => {
	// Get IP from context - this will need to be passed through from the request
	const identifier = "anonymous"; // Default fallback

	const { success, reset } = await ratelimit.limit(identifier);

	if (!success) {
		throw new TRPCError({
			code: "TOO_MANY_REQUESTS",
			message: `Rate limit exceeded. Try again in ${Math.round((reset - Date.now()) / 1000)} seconds.`,
		});
	}

	return opts.next();
};
