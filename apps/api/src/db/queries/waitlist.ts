import type { Database } from "@api/db";
import { waitingListEntry } from "@api/db/schema";

import { and, count, eq, gt, lt, or } from "drizzle-orm";

export async function getWaitlistEntryByUserId(
	db: Database,
	params: { userId?: string }
) {
	try {
		const totalEntries = await db
			.select({ count: count() })
			.from(waitingListEntry);

		if (!params.userId) {
			return { entry: null, rank: null, totalEntries: totalEntries[0].count };
		}

		const entry = await db.query.waitingListEntry.findFirst({
			where: eq(waitingListEntry.userId, params.userId),
			with: {
				user: true,
			},
		});

		if (!entry) {
			return { entry: null, rank: null, totalEntries: totalEntries[0].count };
		}

		// Take all the person with more points than the current person
		// If there are people with the same points, take the ones that were created before the current person
		const result = await db
			.select({ count: count() })
			.from(waitingListEntry)
			.where(
				or(
					gt(waitingListEntry.points, entry.points),
					and(
						eq(waitingListEntry.points, entry.points),
						lt(waitingListEntry.createdAt, entry.createdAt)
					)
				)
			);

		const rank = result[0].count + 1;

		return {
			entry,
			rank,
			totalEntries: totalEntries[0].count,
		};
	} catch (err) {
		console.error("Error in getWaitlistEntryByUserId:", err);
		console.error(
			"Stack trace:",
			err instanceof Error ? err.stack : "No stack trace"
		);
		// Return 0 instead of 666 to make it clear there's an error
		return { entry: null, rank: null, totalEntries: 0 };
	}
}
