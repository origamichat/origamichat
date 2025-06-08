import { TRPCError } from "@trpc/server";
import { TRPCContext } from "../init";

export const withPermission = async <TReturn>(opts: {
  ctx: TRPCContext;
  next: (opts: { ctx: TRPCContext }) => Promise<TReturn>;
}) => {
  const { ctx, next } = opts;

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
