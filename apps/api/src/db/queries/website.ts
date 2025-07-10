import type { Database } from "@api/db";
import type { WebsiteInsert } from "@api/db/schema";
import { website } from "@api/db/schema";

import { and, desc, eq, isNull } from "drizzle-orm";

// Create website
export async function createWebsite(
	db: Database,
	params: {
		orgId: string;
		data: Omit<WebsiteInsert, "organizationId">;
	}
) {
	const [newWebsite] = await db
		.insert(website)
		.values({
			...params.data,
			organizationId: params.orgId,
		})
		.returning();

	return newWebsite;
}

// Get website by ID (with org check)
export async function getWebsiteById(
	db: Database,
	params: {
		orgId: string;
		websiteId: string;
	}
) {
	const [site] = await db
		.select()
		.from(website)
		.where(
			and(
				eq(website.id, params.websiteId),
				eq(website.organizationId, params.orgId),
				isNull(website.deletedAt)
			)
		)
		.limit(1);

	return site;
}

// Get all websites for organization
export async function getWebsitesByOrganization(
	db: Database,
	params: {
		orgId: string;
		status?: string;
		limit?: number;
		offset?: number;
	}
) {
	const websites = await db
		.select()
		.from(website)
		.where(
			and(
				eq(website.organizationId, params.orgId),
				params.status ? eq(website.status, params.status) : undefined,
				isNull(website.deletedAt)
			)
		)
		.orderBy(desc(website.createdAt))
		.limit(params.limit ?? 50)
		.offset(params.offset ?? 0);

	return websites;
}

// Update website
export async function updateWebsite(
	db: Database,
	params: {
		orgId: string;
		websiteId: string;
		data: Partial<Omit<WebsiteInsert, "organizationId">>;
	}
) {
	const [updatedWebsite] = await db
		.update(website)
		.set({
			...params.data,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(website.id, params.websiteId),
				eq(website.organizationId, params.orgId)
			)
		)
		.returning();

	return updatedWebsite;
}

// Soft delete website
export async function deleteWebsite(
	db: Database,
	params: {
		orgId: string;
		websiteId: string;
	}
) {
	const [deletedWebsite] = await db
		.update(website)
		.set({
			deletedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(website.id, params.websiteId),
				eq(website.organizationId, params.orgId)
			)
		)
		.returning();

	return deletedWebsite;
}

// Restore website
export async function restoreWebsite(
	db: Database,
	params: {
		orgId: string;
		websiteId: string;
	}
) {
	const [restoredWebsite] = await db
		.update(website)
		.set({
			deletedAt: null,
			updatedAt: new Date(),
		})
		.where(
			and(
				eq(website.id, params.websiteId),
				eq(website.organizationId, params.orgId)
			)
		)
		.returning();

	return restoredWebsite;
}
