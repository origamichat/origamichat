import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { db, waitingListEntry } from "@cossistant/database";
import { eq, sql } from "drizzle-orm";

const TEST_REDEEM_CODE = "test-redeem-code-12345";

export const waitlistRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { user } }) => {
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return user;
  }),
  redeemReferralCode: protectedProcedure
    .input(
      z.object({
        referralCode: z.string(),
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

      if (!refererEntry && !isTestRedeem) {
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
