import { env } from "@api/env";
import { updateContactSubscriptionStatus } from "@api/lib/resend";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, rateLimitedPublicProcedure } from "../init";

export const resendRouter = createTRPCRouter({
	unsubscribe: rateLimitedPublicProcedure
		.input(
			z.object({
				email: z.string().email(),
			})
		)
		.mutation(async ({ input }) => {
			const { email } = input;

			try {
				const success = await updateContactSubscriptionStatus(
					env.RESEND_AUDIENCE_ID,
					email,
					true // Set unsubscribed to true
				);

				if (!success) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to update subscription status",
					});
				}

				return { success: true, message: "Successfully unsubscribed" };
			} catch (error) {
				console.error("Error unsubscribing contact:", error);
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to process unsubscribe request",
				});
			}
		}),
});
