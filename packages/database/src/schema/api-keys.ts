import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { user, organization } from "./auth";
import { generatePrimaryId } from "../utils/uuid";

export const apiKey = mysqlTable("api_key", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  keyType: mysqlEnum("key_type", ["private", "public"]).notNull(),
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
