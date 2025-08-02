import type { Database } from "@api/db";
import { visitor } from "@api/db/schema";
import { generateULID } from "@api/utils/db/ids";
import { and, eq } from "drizzle-orm";

// Get or create visitor for a website
export async function getOrCreateVisitor(
	db: Database,
	params: {
		websiteId: string;
		organizationId: string;
		visitorId?: string | null;
	}
) {
	// If visitor ID is provided, try to find existing visitor
	if (params.visitorId) {
		const existingVisitor = await db.query.visitor.findFirst({
			where: and(
				eq(visitor.id, params.visitorId),
				eq(visitor.websiteId, params.websiteId)
			),
		});

		if (existingVisitor) {
			// Update last connected timestamp
			await db
				.update(visitor)
				.set({
					lastConnectedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(visitor.id, params.visitorId));

			return existingVisitor;
		}
	}

	// No valid visitor found, create new one
	const newVisitorId = generateULID();
	const [newVisitor] = await db
		.insert(visitor)
		.values({
			id: newVisitorId,
			identifier: newVisitorId, // Using ULID as identifier
			websiteId: params.websiteId,
			organizationId: params.organizationId,
			lastConnectedAt: new Date(),
		})
		.returning();

	return newVisitor;
}
