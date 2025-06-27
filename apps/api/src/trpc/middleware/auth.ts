import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../init";

export const withPermission = async <TReturn>(options: {
	ctx: TRPCContext;
	next: (opts: { ctx: TRPCContext }) => Promise<TReturn>;
}) => {
	const { ctx, next } = options;

	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Session invalid",
		});
	}

	if (!ctx.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "User not found",
		});
	}

	return next({
		ctx,
	});
};
