import { getGeoContext } from "@api/utils/geo";
import { auth, AuthType, Database } from "@origamichat/database";
import { Context } from "hono";
import { db } from "@origamichat/database";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { withPermission } from "./middleware/auth";
import { withPrimaryDbMiddleware } from "./middleware/db";

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
  const user = c.get("user")!;
  const session = c.get("session")!;

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
