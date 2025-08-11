import {
	ConversationEventType,
	ConversationParticipationStatus,
	ConversationPriority,
	ConversationStatus,
	MessageType,
	MessageVisibility,
} from "@cossistant/types";
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
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../../utils/db";
import {
	nanoidPrimaryKey,
	nanoidReference,
	ulidNullableReference,
	ulidPrimaryKey,
	ulidReference,
} from "../../utils/db/ids";

import { aiAgent } from "./ai-agent";
import { organization, user } from "./auth";
import { tag, visitor, website } from "./website";

export const messageTypeEnum = pgEnum(
	"message_type",
	enumToPgEnum(MessageType)
);

// SenderType removed in favor of explicit userId/aiAgentId on message

export const conversationStatusEnum = pgEnum(
	"conversation_status",
	enumToPgEnum(ConversationStatus)
);

export const conversationPriorityEnum = pgEnum(
	"conversation_priority",
	enumToPgEnum(ConversationPriority)
);

export const messageVisibilityEnum = pgEnum(
	"message_visibility",
	enumToPgEnum(MessageVisibility)
);

export const conversationEventTypeEnum = pgEnum(
	"conversation_event_type",
	enumToPgEnum(ConversationEventType)
);

export const conversationParticipationStatusEnum = pgEnum(
	"conversation_participation_status",
	enumToPgEnum(ConversationParticipationStatus)
);

export const conversation = pgTable(
	"conversation",
	{
		id: nanoidPrimaryKey("id"),
		status: conversationStatusEnum("status")
			.default(ConversationStatus.OPEN)
			.notNull(),
		priority: conversationPriorityEnum("priority")
			.default(ConversationPriority.NORMAL)
			.notNull(),
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
		resolutionTime: integer("resolution_time"), // in seconds
		startedAt: timestamp("started_at").$defaultFn(() => new Date()),
		firstResponseAt: timestamp("first_response_at"),
		resolvedAt: timestamp("resolved_at"),
		resolvedByUserId: ulidNullableReference("resolved_by_user_id").references(
			() => user.id
		),
		resolvedByAiAgentId: ulidNullableReference(
			"resolved_by_ai_agent_id"
		).references(() => aiAgent.id),
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
		// Index for resolution data
		index("conversation_org_resolved_idx").on(
			table.organizationId,
			table.resolvedAt
		),
		index("conversation_org_first_response_idx").on(
			table.organizationId,
			table.firstResponseAt
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
		// One of userId or aiAgentId should be present (enforced at application level)
		userId: ulidNullableReference("user_id").references(() => user.id, {
			onDelete: "set null",
		}),
		visitorId: ulidNullableReference("visitor_id").references(
			() => visitor.id,
			{
				onDelete: "set null",
			}
		),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		conversationId: nanoidReference("conversation_id").references(
			() => conversation.id,
			{ onDelete: "cascade" }
		),
		parentMessageId: ulidNullableReference("parent_message_id"),
		aiAgentId: ulidNullableReference("ai_agent_id").references(
			() => aiAgent.id
		),
		modelUsed: text("model_used"),
		visibility: messageVisibilityEnum("visibility")
			.default(MessageVisibility.PUBLIC)
			.notNull(),
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
		// Index for filtering messages by user within organization
		index("message_org_user_idx").on(table.organizationId, table.userId),
		// Index for filtering messages by AI agent
		index("message_ai_agent_idx").on(table.aiAgentId),
		// Index for sorting messages by creation time within organization
		index("message_org_created_at_idx").on(
			table.organizationId,
			table.createdAt
		),
		// Index for message threading (parent-child relationships)
		index("message_parent_idx").on(table.parentMessageId),
		// Index for visibility filtering
		index("message_visibility_idx").on(table.visibility),
		// Index for soft delete queries
		index("message_deleted_at_idx").on(table.deletedAt),
	]
);

export const conversationAssignee = pgTable(
	"conversation_assignee",
	{
		id: ulidPrimaryKey("id"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		conversationId: nanoidReference("conversation_id").references(
			() => conversation.id,
			{ onDelete: "cascade" }
		),
		userId: ulidReference("user_id").references(() => user.id, {
			onDelete: "cascade",
		}),
		assignedByUserId: ulidNullableReference("assigned_by_user_id").references(
			() => user.id,
			{ onDelete: "set null" }
		),
		assignedByAiAgentId: ulidNullableReference(
			"assigned_by_ai_agent_id"
		).references(() => aiAgent.id, { onDelete: "set null" }),
		assignedAt: timestamp("assigned_at")
			.$defaultFn(() => new Date())
			.notNull(),
		unassignedAt: timestamp("unassigned_at"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		index("conversation_assignee_org_idx").on(table.organizationId),
		index("conversation_assignee_conv_idx").on(table.conversationId),
		index("conversation_assignee_user_idx").on(table.userId),
		uniqueIndex("conversation_assignee_unique").on(
			table.conversationId,
			table.userId
		),
	]
);

export const conversationParticipant = pgTable(
	"conversation_participant",
	{
		id: ulidPrimaryKey("id"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		conversationId: nanoidReference("conversation_id").references(
			() => conversation.id,
			{ onDelete: "cascade" }
		),
		userId: ulidReference("user_id").references(() => user.id, {
			onDelete: "cascade",
		}),
		status: conversationParticipationStatusEnum("status")
			.default(ConversationParticipationStatus.ACTIVE)
			.notNull(),
		reason: text("reason"),
		requestedByUserId: ulidNullableReference("requested_by_user_id").references(
			() => user.id,
			{ onDelete: "set null" }
		),
		requestedByAiAgentId: ulidNullableReference(
			"requested_by_ai_agent_id"
		).references(() => aiAgent.id, { onDelete: "set null" }),
		joinedAt: timestamp("joined_at")
			.$defaultFn(() => new Date())
			.notNull(),
		leftAt: timestamp("left_at"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		index("conversation_participant_org_idx").on(table.organizationId),
		index("conversation_participant_conv_idx").on(table.conversationId),
		index("conversation_participant_user_idx").on(table.userId),
		uniqueIndex("conversation_participant_unique").on(
			table.conversationId,
			table.userId
		),
	]
);

export const conversationEvent = pgTable(
	"conversation_event",
	{
		id: ulidPrimaryKey("id"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		conversationId: nanoidReference("conversation_id").references(
			() => conversation.id,
			{ onDelete: "cascade" }
		),
		type: conversationEventTypeEnum("type").notNull(),
		actorUserId: ulidNullableReference("actor_user_id").references(
			() => user.id,
			{ onDelete: "set null" }
		),
		actorAiAgentId: ulidNullableReference("actor_ai_agent_id").references(
			() => aiAgent.id,
			{ onDelete: "set null" }
		),
		targetUserId: ulidNullableReference("target_user_id").references(
			() => user.id,
			{ onDelete: "set null" }
		),
		targetAiAgentId: ulidNullableReference("target_ai_agent_id").references(
			() => aiAgent.id,
			{ onDelete: "set null" }
		),
		message: text("message"),
		metadata: jsonb("metadata"),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		index("conversation_event_org_idx").on(table.organizationId),
		index("conversation_event_conv_idx").on(table.conversationId),
		index("conversation_event_type_idx").on(table.type),
	]
);

export const conversationTag = pgTable(
	"conversation_tag",
	{
		id: ulidPrimaryKey("id"),
		organizationId: ulidReference("organization_id").references(
			() => organization.id,
			{ onDelete: "cascade" }
		),
		conversationId: nanoidReference("conversation_id").references(
			() => conversation.id,
			{ onDelete: "cascade" }
		),
		tagId: ulidReference("tag_id").references(() => tag.id, {
			onDelete: "cascade",
		}),
		addedByUserId: ulidNullableReference("added_by_user_id").references(
			() => user.id,
			{ onDelete: "set null" }
		),
		addedByAiAgentId: ulidNullableReference("added_by_ai_agent_id").references(
			() => aiAgent.id,
			{ onDelete: "set null" }
		),
		createdAt: timestamp("created_at")
			.$defaultFn(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => [
		index("conversation_tag_org_idx").on(table.organizationId),
		index("conversation_tag_conv_idx").on(table.conversationId),
		index("conversation_tag_tag_idx").on(table.tagId),
		uniqueIndex("conversation_tag_unique").on(
			table.conversationId,
			table.tagId
		),
		index("conversation_tag_deleted_at_idx").on(table.deletedAt),
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
		messages: many(message),
		assignees: many(conversationAssignee),
		participants: many(conversationParticipant),
		events: many(conversationEvent),
		tags: many(conversationTag),
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
	user: one(user, {
		fields: [message.userId],
		references: [user.id],
	}),
	aiAgent: one(aiAgent, {
		fields: [message.aiAgentId],
		references: [aiAgent.id],
	}),
	visitor: one(visitor, {
		fields: [message.visitorId],
		references: [visitor.id],
	}),
	parentMessage: one(message, {
		fields: [message.parentMessageId],
		references: [message.id],
	}),
}));

export const conversationTagRelations = relations(
	conversationTag,
	({ one }) => ({
		organization: one(organization, {
			fields: [conversationTag.organizationId],
			references: [organization.id],
		}),
		conversation: one(conversation, {
			fields: [conversationTag.conversationId],
			references: [conversation.id],
		}),
		tag: one(tag, {
			fields: [conversationTag.tagId],
			references: [tag.id],
		}),
		addedByUser: one(user, {
			fields: [conversationTag.addedByUserId],
			references: [user.id],
		}),
		addedByAiAgent: one(aiAgent, {
			fields: [conversationTag.addedByAiAgentId],
			references: [aiAgent.id],
		}),
	})
);

export type ConversationSelect = InferSelectModel<typeof conversation>;
export type ConversationInsert = InferInsertModel<typeof conversation>;

export type MessageSelect = InferSelectModel<typeof message>;
export type MessageInsert = InferInsertModel<typeof message>;

export type ConversationAssigneeSelect = InferSelectModel<
	typeof conversationAssignee
>;
export type ConversationAssigneeInsert = InferInsertModel<
	typeof conversationAssignee
>;

export type ConversationParticipantSelect = InferSelectModel<
	typeof conversationParticipant
>;
export type ConversationParticipantInsert = InferInsertModel<
	typeof conversationParticipant
>;

export type ConversationEventSelect = InferSelectModel<
	typeof conversationEvent
>;
export type ConversationEventInsert = InferInsertModel<
	typeof conversationEvent
>;

export type ConversationTagSelect = InferSelectModel<typeof conversationTag>;
export type ConversationTagInsert = InferInsertModel<typeof conversationTag>;
