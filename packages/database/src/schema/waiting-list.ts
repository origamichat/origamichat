import { relations } from "drizzle-orm";
import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { generateULID, ulid } from "../utils/ids";

export const waitingListEntry = pgTable("waiting_list_entry", {
  id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
  userId: ulid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fromReferralCode: text("from_referral_code"),
  uniqueReferralCode: text("unique_referral_code").notNull().unique(),
  points: integer("points").notNull().default(1),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const waitingListEntryRelations = relations(
  waitingListEntry,
  ({ one }) => ({
    user: one(user, {
      fields: [waitingListEntry.userId],
      references: [user.id],
    }),
  })
);
