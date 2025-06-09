import type { OrigamiTRPCRouter } from "./router";
import type { TRPCContext } from "./init";
import type { inferReactQueryProcedureOptions } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type ReactQueryOptions =
  inferReactQueryProcedureOptions<OrigamiTRPCRouter>;
export type RouterInputs = inferRouterInputs<OrigamiTRPCRouter>;
export type RouterOutputs = inferRouterOutputs<OrigamiTRPCRouter>;

// Export these types for the client
export type { OrigamiTRPCRouter, TRPCContext };
