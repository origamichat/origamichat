import { db } from "@api/db";
import { getWaitlistEntryByUserId } from "@api/db/queries/waitlist";
import { waitingListEntry } from "@api/db/schema";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@api/trpc/init";
import { optionalUserIdSchema, referralCodeSchema } from "@cossistant/types";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import z from "zod";

const TEST_REDEEM_CODE = "test-redeem-code-12345";

export const waitlistRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx: { user } }) => {
		if (!user) {
			throw new TRPCError({ code: "NOT_FOUND" });
		}

		return user;
	}),
	getWaitlistEntry: publicProcedure
		.input(
			z.object({
				userId: optionalUserIdSchema,
			})
		)
		.query(async ({ input }) => {
			return getWaitlistEntryByUserId(db, { userId: input.userId });
		}),
	redeemReferralCode: protectedProcedure
		.input(
			z.object({
				referralCode: referralCodeSchema,
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { referralCode } = input;
			const { user } = ctx;

			const isTestRedeem = referralCode === TEST_REDEEM_CODE;

			const connectedUserEntry = await db.query.waitingListEntry.findFirst({
				where: eq(waitingListEntry.userId, user.id),
			});

			// Check if the user has already redeemed the referral code
			if (connectedUserEntry?.fromReferralCode) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Referral not valid",
				});
			}

			const refererEntry = await db.query.waitingListEntry.findFirst({
				where: eq(waitingListEntry.uniqueReferralCode, referralCode),
			});

			if (!(refererEntry || isTestRedeem)) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Referral code not found",
				});
			}

			const userGettingPoints = isTestRedeem ? user.id : refererEntry?.userId;

			if (!userGettingPoints) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User not found",
				});
			}

			// Update the entries
			await Promise.all([
				// Set the referral code for the connected user
				db
					.update(waitingListEntry)
					.set({
						fromReferralCode: referralCode,
					})
					.where(eq(waitingListEntry.userId, user.id)),
				// Add points to the referer
				db
					.update(waitingListEntry)
					.set({
						points: sql<number>`${waitingListEntry.points} + ${5}`,
					})
					.where(eq(waitingListEntry.userId, userGettingPoints)),
			]);

			return {
				status: "success",
			};
		}),
});
