import {
  pgTable,
  pgEnum,
  boolean,
  timestamp,
  text,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

import { enumToPgEnum } from "@database/utils/db";
import { website } from "@database/schema/chat";
import { user, organization } from "@database/schema/auth";
import { generateULID, ulid } from "@database/utils/ids";
import { APIKeyType } from "@database/enums";

export const keyTypeEnum = pgEnum("key_type", enumToPgEnum(APIKeyType));

export const apiKey = pgTable(
  "api_key",
  {
    id: ulid("id").primaryKey().notNull().$defaultFn(generateULID),
    keyType: keyTypeEnum("key_type").notNull(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    name: text("name").notNull(),
    organizationId: ulid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    websiteId: ulid("website_id")
      .notNull()
      .references(() => website.id, { onDelete: "cascade" }),
    createdBy: ulid("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isActive: boolean("is_active")
      .$defaultFn(() => true)
      .notNull(),
    isTest: boolean("is_test")
      .$defaultFn(() => false)
      .notNull(),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"),
    revokedAt: timestamp("revoked_at"),
    revokedBy: ulid("revoked_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    // Index for key lookups
    index("api_key_key_idx").on(table.key),
    // Index for organization keys
    index("api_key_org_idx").on(table.organizationId),
    // Index for active keys
    index("api_key_active_idx").on(table.isActive),
    // Index for test keys
    index("api_key_test_idx").on(table.isTest),
    // Index for expired keys
    index("api_key_expires_at_idx").on(table.expiresAt),
    // Index for revoked keys
    index("api_key_revoked_at_idx").on(table.revokedAt),
  ]
);

// Relations
export const apiKeyRelations = relations(apiKey, ({ one }) => ({
  organization: one(organization, {
    fields: [apiKey.organizationId],
    references: [organization.id],
    relationName: "ApiKeyOrganization",
  }),
  website: one(website, {
    fields: [apiKey.websiteId],
    references: [website.id],
  }),
  creator: one(user, {
    fields: [apiKey.createdBy],
    references: [user.id],
  }),
  revoker: one(user, {
    fields: [apiKey.revokedBy],
    references: [user.id],
  }),
}));

export type ApiKeySelect = InferSelectModel<typeof apiKey>;
export type ApiKeyInsert = InferInsertModel<typeof apiKey>;
