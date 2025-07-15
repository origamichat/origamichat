import type { Database } from "@api/db";
import { db } from "@api/db";
import type { AuthType, auth } from "@api/lib/auth";
import { getGeoContext } from "@api/utils/geo";
import { initTRPC } from "@trpc/server";
import type { Context } from "hono";
import superjson from "superjson";
import { withPermission } from "./middleware/auth";
import { withPrimaryDbMiddleware } from "./middleware/db";
import { withRateLimitMiddleware } from "./middleware/rate-limit";

export type TRPCContext = {
	user: typeof auth.$Infer.Session.user;
	session: typeof auth.$Infer.Session.session;
	db: Database;
	geo: ReturnType<typeof getGeoContext>;
};

export const createTRPCContext = async (
	_: unknown,
	c: Context<AuthType>
): Promise<TRPCContext> => {
	const user = c.get("user") as typeof auth.$Infer.Session.user;
	const session = c.get("session") as typeof auth.$Infer.Session.session;

	const geo = getGeoContext(c.req);

	return {
		user,
		session,
		geo,
		db,
	};
};

const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure.use(withPrimaryDbMiddleware);

const withPermissionMiddleware = t.middleware(async (opts) => {
	return withPermission({
		ctx: opts.ctx,
		next: opts.next,
	});
});

export const protectedProcedure = t.procedure
	.use(withPermissionMiddleware)
	.use(withPrimaryDbMiddleware);

export const rateLimitedPublicProcedure = t.procedure
	.use(withRateLimitMiddleware)
	.use(withPrimaryDbMiddleware);
