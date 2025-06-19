import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { generateULID, ulid } from "@database/utils/ids";

import { organization, user } from "@database/schema/auth";
import { relations } from "drizzle-orm";
import {
  ConversationPriority,
  ConversationStatus,
  MessageType,
  SenderType,
  WebsiteInstallationTarget,
} from "@database/enums";
import { enumToPgEnum } from "@database/utils/db";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { apiKey } from "@database/schema/api-keys";

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

export const websiteInstallationTargetEnum = pgEnum(
  "website_installation_target",
  enumToPgEnum(WebsiteInstallationTarget)
);

export const website = pgTable(
  "website",
  {
    id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
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
    organizationId: ulid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
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
    id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
    identifier: text("identifier").notNull(),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    metadata: jsonb("metadata"),
    organizationId: ulid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    websiteId: ulid("website_id")
      .notNull()
      .references(() => website.id, { onDelete: "cascade" }),
    userId: ulid("user_id").references(() => user.id, { onDelete: "set null" }),
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

export const aiAgent = pgTable(
  "ai_agent",
  {
    id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
    name: text("name").notNull(),
    description: text("description"),
    basePrompt: text("base_prompt").notNull(),
    model: text("model").notNull(),
    temperature: integer("temperature"),
    maxTokens: integer("max_tokens"),
    organizationId: ulid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    websiteId: ulid("website_id")
      .notNull()
      .references(() => website.id, { onDelete: "cascade" }),
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

export const conversation = pgTable(
  "conversation",
  {
    id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
    status: conversationStatusEnum("status")
      .default(ConversationStatus.OPEN)
      .notNull(),
    priority: conversationPriorityEnum("priority")
      .default(ConversationPriority.NORMAL)
      .notNull(),
    assignedTeamMemberId: ulid("assigned_team_member_id").references(
      () => user.id
    ),
    organizationId: ulid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    visitorId: ulid("visitor_id")
      .notNull()
      .references(() => visitor.id, { onDelete: "cascade" }),
    websiteId: ulid("website_id")
      .notNull()
      .references(() => website.id, { onDelete: "cascade" }),
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
    id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
    content: jsonb("content").notNull(),
    type: messageTypeEnum("type").default(MessageType.TEXT).notNull(),
    senderType: senderTypeEnum("sender_type").notNull(),
    senderId: ulid("sender_id").notNull(),
    organizationId: ulid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    conversationId: ulid("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    parentMessageId: ulid("parent_message_id"),
    aiAgentId: ulid("ai_agent_id").references(() => aiAgent.id),
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

export type WebsiteSelect = InferSelectModel<typeof website>;
export type WebsiteInsert = InferInsertModel<typeof website>;

export type VisitorSelect = InferSelectModel<typeof visitor>;
export type VisitorInsert = InferInsertModel<typeof visitor>;

export type AiAgentSelect = InferSelectModel<typeof aiAgent>;
export type AiAgentInsert = InferInsertModel<typeof aiAgent>;

export type ConversationSelect = InferSelectModel<typeof conversation>;
export type ConversationInsert = InferInsertModel<typeof conversation>;

export type MessageSelect = InferSelectModel<typeof message>;
export type MessageInsert = InferInsertModel<typeof message>;
