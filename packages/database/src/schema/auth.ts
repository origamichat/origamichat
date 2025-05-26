import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { generatePrimaryId } from "../utils/uuid";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
  impersonatedBy: text("impersonated_by"),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const organization = mysqlTable("organization", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = mysqlTable("member", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = mysqlTable("invitation", {
  id: varchar("id", { length: 26 }).primaryKey().$defaultFn(generatePrimaryId),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: varchar("inviter_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
