import { generatePrimaryId } from "@/utils/uuid";
import { InferSelectModel } from "drizzle-orm";
import { InferInsertModel } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
      .$defaultFn(() => false)
      .notNull(),
    image: text("image"),
    isAnonymous: boolean("is_anonymous")
      .$defaultFn(() => false)
      .notNull(),
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
  },
  (table) => [
    // Index for email lookups
    index("user_email_idx").on(table.email),
    // Index for role-based queries
    index("user_role_idx").on(table.role),
    // Index for banned users
    index("user_banned_idx").on(table.banned),
  ]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [
    // Index for token lookups
    index("session_token_idx").on(table.token),
    // Index for user sessions
    index("session_user_idx").on(table.userId),
    // Index for active organization
    index("session_active_org_idx").on(table.activeOrganizationId),
    // Index for expired sessions cleanup
    index("session_expires_at_idx").on(table.expiresAt),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
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
  },
  (table) => [
    // Index for provider lookups
    index("account_provider_idx").on(table.providerId),
    // Index for user accounts
    index("account_user_idx").on(table.userId),
    // Index for token expiration
    index("account_token_expires_idx").on(table.accessTokenExpiresAt),
  ]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
      () => /* @__PURE__ */ new Date()
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
      () => /* @__PURE__ */ new Date()
    ),
  },
  (table) => [
    // Index for identifier lookups
    index("verification_identifier_idx").on(table.identifier),
    // Index for expired verifications cleanup
    index("verification_expires_at_idx").on(table.expiresAt),
  ]
);

export const organization = pgTable(
  "organization",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    name: text("name").notNull(),
    slug: text("slug").unique(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull(),
    metadata: text("metadata"),
  },
  (table) => [
    // Index for slug lookups
    index("organization_slug_idx").on(table.slug),
  ]
);

export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("member").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [
    // Index for organization members
    index("member_org_idx").on(table.organizationId),
    // Index for user memberships
    index("member_user_idx").on(table.userId),
    // Index for role-based queries
    index("member_role_idx").on(table.role),
  ]
);

export const invitation = pgTable(
  "invitation",
  {
    id: text("id").primaryKey().$defaultFn(generatePrimaryId),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Index for organization invitations
    index("invitation_org_idx").on(table.organizationId),
    // Index for email lookups
    index("invitation_email_idx").on(table.email),
    // Index for status-based queries
    index("invitation_status_idx").on(table.status),
    // Index for expired invitations cleanup
    index("invitation_expires_at_idx").on(table.expiresAt),
  ]
);

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  memberships: many(member),
  invitations: many(invitation),
}));

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
}));

export type OrganizationSelect = InferSelectModel<typeof organization>;
export type OrganizationInsert = InferInsertModel<typeof organization>;

export type UserSelect = InferSelectModel<typeof user>;
export type UserInsert = InferInsertModel<typeof user>;

export type SessionSelect = InferSelectModel<typeof session>;
export type SessionInsert = InferInsertModel<typeof session>;

export type AccountSelect = InferSelectModel<typeof account>;
export type AccountInsert = InferInsertModel<typeof account>;

export type VerificationSelect = InferSelectModel<typeof verification>;
export type VerificationInsert = InferInsertModel<typeof verification>;

export type MemberSelect = InferSelectModel<typeof member>;
export type MemberInsert = InferInsertModel<typeof member>;

export type InvitationSelect = InferSelectModel<typeof invitation>;
export type InvitationInsert = InferInsertModel<typeof invitation>;
