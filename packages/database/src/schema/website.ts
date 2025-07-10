import {
	type InferInsertModel,
	type InferSelectModel,
	relations,
} from "drizzle-orm";

import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { WebsiteInstallationTarget } from "../enums";
import { enumToPgEnum } from "../utils/db";
import {
	ulidNullableReference,
	ulidPrimaryKey,
	ulidReference,
} from "../utils/ids";
import { aiAgent } from "./ai-agent";
import { apiKey } from "./api-keys";
import { organization, user } from "./auth";
import { conversation } from "./conversation";

export const websiteInstallationTargetEnum = pgEnum(
	"website_installation_target",
	enumToPgEnum(WebsiteInstallationTarget)
);

export const website = pgTable(
	"website",
	{
		id: ulidPrimaryKey("id"),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		domain: text("domain").notNull(),
		isDomainOwnershipVerified: boolean("is_domain_ownership_verified")
			.default(false)
			.notNull(),
		description: text("description"),
		logoUrl: text("logo_url"),
		whitelistedDomains: text("whitelisted_domains").array().notNull(),
		installationTarget: websiteInstallationTargetEnum("installation_target")
			.$defaultFn(() => WebsiteInstallationTarget.NEXTJS)
			.notNull(),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		status: text("status").default("active").notNull(),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => [
		// Index for filtering by organization and status
		index("website_org_status_idx").on(table.organizationId, table.status),
		// Index for soft delete queries
		index("website_deleted_at_idx").on(table.deletedAt),
		index("website_slug_idx").on(table.slug),
		index("website_domain_idx").on(table.domain),
		index("website_org_domain_idx").on(
			table.isDomainOwnershipVerified,
			table.domain
		),
	]
);

export const visitor = pgTable(
	"visitor",
	{
		id: ulidPrimaryKey("id"),
		identifier: text("identifier").notNull(),
		name: text("name"),
		email: text("email"),
		phone: text("phone"),
		metadata: jsonb("metadata"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		websiteId: ulidReference("website_id")
			.notNull()
			.references(() => website.id, { onDelete: "cascade" }),
		userId: ulidNullableReference("user_id").references(() => user.id, {
			onDelete: "set null",
		}),
		lastConnectedAt: timestamp("last_connected_at"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => [
		// Index for tenant-scoped queries (most important)
		index("visitor_org_idx").on(table.organizationId),
		// Composite index for organization + website queries
		index("visitor_org_website_idx").on(table.organizationId, table.websiteId),
		// Index for looking up visitors by website
		index("visitor_website_idx").on(table.websiteId),
		// Index for looking up visitors by user
		index("visitor_user_idx").on(table.userId),
		// Index for active visitors query within organization
		index("visitor_org_connected_idx").on(
			table.organizationId,
			table.lastConnectedAt
		),
		// Index for soft delete queries
		index("visitor_deleted_at_idx").on(table.deletedAt),
		// Unique index for identifier per website
		uniqueIndex("visitor_identifier_website_idx").on(
			table.identifier,
			table.websiteId
		),
	]
);

// Relations
export const websiteRelations = relations(website, ({ many, one }) => ({
	organization: one(organization, {
		fields: [website.organizationId],
		references: [organization.id],
	}),
	visitors: many(visitor),
	aiAgents: many(aiAgent),
	conversations: many(conversation),
	apiKeys: many(apiKey),
}));

export const visitorRelations = relations(visitor, ({ one, many }) => ({
	organization: one(organization, {
		fields: [visitor.organizationId],
		references: [organization.id],
	}),
	website: one(website, {
		fields: [visitor.websiteId],
		references: [website.id],
	}),
	user: one(user, {
		fields: [visitor.userId],
		references: [user.id],
	}),
	conversations: many(conversation),
}));

export type WebsiteSelect = InferSelectModel<typeof website>;
export type WebsiteInsert = InferInsertModel<typeof website>;

export type VisitorSelect = InferSelectModel<typeof visitor>;
export type VisitorInsert = InferInsertModel<typeof visitor>;
