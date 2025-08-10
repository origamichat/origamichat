import {
	type InferInsertModel,
	type InferSelectModel,
	relations,
} from "drizzle-orm";
import {
	boolean,
	doublePrecision,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { ulidPrimaryKey, ulidReference } from "../../utils/db/ids";
import { organization } from "./auth";
import { message } from "./conversation";
import { website } from "./website";

export const aiAgent = pgTable(
	"ai_agent",
	{
		id: ulidPrimaryKey("id"),
		name: text("name").notNull(),
		description: text("description"),
		basePrompt: text("base_prompt").notNull(),
		model: text("model").notNull(),
		temperature: doublePrecision("temperature"),
		maxTokens: integer("max_tokens"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		websiteId: ulidReference("website_id").references(() => website.id, {
			onDelete: "cascade",
		}),
		isActive: boolean("is_active").default(true).notNull(),
		lastUsedAt: timestamp("last_used_at"),
		usageCount: integer("usage_count").default(0).notNull(),
		metadata: jsonb("metadata"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		updatedAt: timestamp("updated_at")
			.$defaultFn(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => [
		// Index for filtering by organization and website
		index("ai_agent_org_website_idx").on(table.organizationId, table.websiteId),
		// Index for active agents query
		index("ai_agent_active_idx").on(table.isActive),
		// Index for soft delete queries
		index("ai_agent_deleted_at_idx").on(table.deletedAt),
	]
);

export const aiAgentRelations = relations(aiAgent, ({ one, many }) => ({
	organization: one(organization, {
		fields: [aiAgent.organizationId],
		references: [organization.id],
	}),
	website: one(website, {
		fields: [aiAgent.websiteId],
		references: [website.id],
	}),
	messages: many(message),
}));

export type AiAgentSelect = InferSelectModel<typeof aiAgent>;
export type AiAgentInsert = InferInsertModel<typeof aiAgent>;
