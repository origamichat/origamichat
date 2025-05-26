import { user, organization } from "./auth";
import { generatePrimaryId } from "../utils/uuid";
import {
  pgTable,
  pgEnum,
  boolean,
  timestamp,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const keyTypeEnum = pgEnum("key_type", ["private", "public"]);

export const apiKey = pgTable("api_key", {
  id: text("id").primaryKey().$defaultFn(generatePrimaryId),
  keyType: keyTypeEnum("key_type").notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by", { length: 36 })
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
  revokedBy: varchar("revoked_by", { length: 36 }).references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
