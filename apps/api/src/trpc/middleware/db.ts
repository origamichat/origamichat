import { TRPCError } from "@trpc/server";
import { TRPCContext } from "../init.js";

export const withPrimaryDbMiddleware = async <TReturn>(opts: {
  ctx: TRPCContext;
  next: (opts: { ctx: TRPCContext }) => Promise<TReturn>;
}) => {
  const { ctx, next } = opts;

  if (!ctx.db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not initialized",
    });
  }

  return next({
    ctx,
  });
};
