import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { ulidPrimaryKey, ulidReference } from "../../utils/db/ids";

import { user } from "./auth";

export const waitingListEntry = pgTable("waiting_list_entry", {
	id: ulidPrimaryKey("id"),
	userId: ulidReference("user_id").references(() => user.id, {
		onDelete: "cascade",
	}),
	fromReferralCode: text("from_referral_code"),
	accessGranted: boolean("access_granted").notNull().default(false),
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
