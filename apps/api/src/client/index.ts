// Everything exported here is available to the other apps in the monorepo
import { auth as authLib } from "../lib/auth";
export type { OrigamiTRPCRouter } from "../routes";

export type OrigamiUser = typeof auth.$Infer.Session.user;
export type OrigamiSession = typeof auth.$Infer.Session.session;

export const auth = authLib;
