import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../init.js";

export const withPrimaryDbMiddleware = async <TReturn>(options: {
  ctx: TRPCContext;
  next: (opts: { ctx: TRPCContext }) => Promise<TReturn>;
}) => {
  const { ctx, next } = options;

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
