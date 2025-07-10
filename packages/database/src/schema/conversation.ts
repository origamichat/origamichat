import {
	type InferInsertModel,
	type InferSelectModel,
	relations,
} from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import {
	ConversationPriority,
	ConversationStatus,
	MessageType,
	SenderType,
} from "../enums";

import { enumToPgEnum } from "../utils/db";
import {
	ulidNullableReference,
	ulidPrimaryKey,
	ulidReference,
} from "../utils/ids";
import { aiAgent } from "./ai-agent";
import { organization, user } from "./auth";
import { visitor, website } from "./website";

export const messageTypeEnum = pgEnum(
	"message_type",
	enumToPgEnum(MessageType)
);

export const senderTypeEnum = pgEnum("sender_type", enumToPgEnum(SenderType));

export const conversationStatusEnum = pgEnum(
	"conversation_status",
	enumToPgEnum(ConversationStatus)
);

export const conversationPriorityEnum = pgEnum(
	"conversation_priority",
	enumToPgEnum(ConversationPriority)
);

export const conversation = pgTable(
	"conversation",
	{
		id: ulidPrimaryKey("id"),
		status: conversationStatusEnum("status")
			.default(ConversationStatus.OPEN)
			.notNull(),
		priority: conversationPriorityEnum("priority")
			.default(ConversationPriority.NORMAL)
			.notNull(),
		assignedTeamMemberId: ulidNullableReference(
			"assigned_team_member_id"
		).references(() => user.id),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		visitorId: ulidReference("visitor_id").references(() => visitor.id, {
			onDelete: "cascade",
		}),
		websiteId: ulidReference("website_id").references(() => website.id, {
			onDelete: "cascade",
		}),
		title: text("title"),
		readBy: text("read_by").array(),
		lastReadAt: jsonb("last_read_at"), // Stores { userId: timestamp }
		lastMessageAt: timestamp("last_message_at"),
		resolutionTime: integer("resolution_time"), // in seconds
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
		index("conversation_org_idx").on(table.organizationId),
		// Composite index for organization + status queries
		index("conversation_org_status_idx").on(table.organizationId, table.status),
		// Composite index for organization + priority queries
		index("conversation_org_priority_idx").on(
			table.organizationId,
			table.priority
		),
		// Index for filtering conversations by website and status
		index("conversation_website_status_idx").on(table.websiteId, table.status),
		// Index for filtering conversations by visitor
		index("conversation_visitor_idx").on(table.visitorId),
		// Index for filtering conversations by assigned team member within org
		index("conversation_org_team_member_idx").on(
			table.organizationId,
			table.assignedTeamMemberId
		),
		// Index for sorting by last message within organization
		index("conversation_org_last_message_idx").on(
			table.organizationId,
			table.lastMessageAt
		),
		// Index for soft delete queries
		index("conversation_deleted_at_idx").on(table.deletedAt),
	]
);

export const message = pgTable(
	"message",
	{
		id: ulidPrimaryKey("id"),
		content: jsonb("content").notNull(),
		type: messageTypeEnum("type").default(MessageType.TEXT).notNull(),
		senderType: senderTypeEnum("sender_type").notNull(),
		senderId: ulidReference("sender_id"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		conversationId: ulidReference("conversation_id").references(
			() => conversation.id,
			{ onDelete: "cascade" }
		),
		parentMessageId: ulidNullableReference("parent_message_id"),
		aiAgentId: ulidNullableReference("ai_agent_id").references(
			() => aiAgent.id
		),
		modelUsed: text("model_used"),
		reactions: jsonb("reactions"), // Stores { userId: reaction }
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
		// Index for tenant-scoped queries (most important)
		index("message_org_idx").on(table.organizationId),
		// Index for filtering messages by conversation
		index("message_conversation_idx").on(table.conversationId),
		// Composite index for organization + conversation queries
		index("message_org_conversation_idx").on(
			table.organizationId,
			table.conversationId
		),
		// Index for filtering messages by sender within organization
		index("message_org_sender_idx").on(
			table.organizationId,
			table.senderId,
			table.senderType
		),
		// Index for filtering messages by AI agent
		index("message_ai_agent_idx").on(table.aiAgentId),
		// Index for sorting messages by creation time within organization
		index("message_org_created_at_idx").on(
			table.organizationId,
			table.createdAt
		),
		// Index for message threading (parent-child relationships)
		index("message_parent_idx").on(table.parentMessageId),
		// Index for soft delete queries
		index("message_deleted_at_idx").on(table.deletedAt),
	]
);

export const conversationRelations = relations(
	conversation,
	({ one, many }) => ({
		organization: one(organization, {
			fields: [conversation.organizationId],
			references: [organization.id],
		}),
		website: one(website, {
			fields: [conversation.websiteId],
			references: [website.id],
		}),
		visitor: one(visitor, {
			fields: [conversation.visitorId],
			references: [visitor.id],
		}),
		assignedTeamMember: one(user, {
			fields: [conversation.assignedTeamMemberId],
			references: [user.id],
		}),
		messages: many(message),
	})
);

export const messageRelations = relations(message, ({ one }) => ({
	organization: one(organization, {
		fields: [message.organizationId],
		references: [organization.id],
	}),
	conversation: one(conversation, {
		fields: [message.conversationId],
		references: [conversation.id],
	}),
	aiAgent: one(aiAgent, {
		fields: [message.aiAgentId],
		references: [aiAgent.id],
	}),
	parentMessage: one(message, {
		fields: [message.parentMessageId],
		references: [message.id],
	}),
}));

export type ConversationSelect = InferSelectModel<typeof conversation>;
export type ConversationInsert = InferInsertModel<typeof conversation>;

export type MessageSelect = InferSelectModel<typeof message>;
export type MessageInsert = InferInsertModel<typeof message>;
