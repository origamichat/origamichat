import { router, publicProcedure } from "@/routes/trpc";
import { z } from "zod";

export const origamiTRPCRouter = router({
  findByProductCode: publicProcedure
    .meta({ openapi: { method: "GET", path: "/find" } })
    .input(z.object({ code: z.string() }))
    .output(z.object({ drink: z.object({ name: z.string() }) }))
    .query(async ({ input }) => {
      const drink = {
        name: "Old Fashioned",
      };
      return { drink: drink };
    }),
});

export type OrigamiTRPCRouter = typeof origamiTRPCRouter;
