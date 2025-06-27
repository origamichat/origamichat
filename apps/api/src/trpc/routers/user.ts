import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx: { db, session, user } }) => {
		if (!user) {
			throw new TRPCError({ code: "NOT_FOUND" });
		}

		return user;
	}),
});
