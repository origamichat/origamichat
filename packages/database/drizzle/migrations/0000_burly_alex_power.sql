CREATE TYPE "public"."key_type" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TYPE "public"."conversation_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('open', 'resolved', 'blocked', 'pending');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'file');--> statement-breakpoint
CREATE TYPE "public"."sender_type" AS ENUM('visitor', 'team_member', 'ai');--> statement-breakpoint
CREATE TYPE "public"."website_installation_target" AS ENUM('nextjs', 'react');--> statement-breakpoint
CREATE TABLE "ai_agent" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"base_prompt" text NOT NULL,
	"model" text NOT NULL,
	"temperature" integer,
	"max_tokens" integer,
	"organization_id" varchar(26) NOT NULL,
	"website_id" varchar(26) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_used_at" timestamp,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"key_type" "key_type" NOT NULL,
	"key" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"website_id" varchar(26) NOT NULL,
	"created_by" varchar(26) NOT NULL,
	"is_active" boolean NOT NULL,
	"is_test" boolean NOT NULL,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"revoked_at" timestamp,
	"revoked_by" varchar(26),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "api_key_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" varchar(26) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" varchar(26) NOT NULL,
	"active_organization_id" varchar(26),
	"impersonated_by" varchar(26),
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"is_anonymous" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"status" "conversation_status" DEFAULT 'open' NOT NULL,
	"priority" "conversation_priority" DEFAULT 'normal' NOT NULL,
	"assigned_team_member_id" varchar(26),
	"organization_id" varchar(26) NOT NULL,
	"visitor_id" varchar(26) NOT NULL,
	"website_id" varchar(26) NOT NULL,
	"title" text,
	"read_by" text[],
	"last_read_at" jsonb,
	"last_message_at" timestamp,
	"resolution_time" integer,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"type" "message_type" DEFAULT 'text' NOT NULL,
	"sender_type" "sender_type" NOT NULL,
	"sender_id" varchar(26) NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"conversation_id" varchar(26) NOT NULL,
	"parent_message_id" varchar(26),
	"ai_agent_id" varchar(26),
	"model_used" text,
	"reactions" jsonb,
	"metadata" jsonb,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "waiting_list_entry" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"from_referral_code" text,
	"access_granted" boolean DEFAULT false NOT NULL,
	"unique_referral_code" text NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "waiting_list_entry_unique_referral_code_unique" UNIQUE("unique_referral_code")
);
--> statement-breakpoint
CREATE TABLE "visitor" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"metadata" jsonb,
	"organization_id" varchar(26) NOT NULL,
	"website_id" varchar(26) NOT NULL,
	"user_id" varchar(26),
	"last_connected_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "website" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text NOT NULL,
	"is_domain_ownership_verified" boolean DEFAULT false NOT NULL,
	"description" text,
	"logo_url" text,
	"whitelisted_domains" text[] NOT NULL,
	"installation_target" "website_installation_target" NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "website_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "ai_agent" ADD CONSTRAINT "ai_agent_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_agent" ADD CONSTRAINT "ai_agent_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_revoked_by_user_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_assigned_team_member_id_user_id_fk" FOREIGN KEY ("assigned_team_member_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_visitor_id_visitor_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waiting_list_entry" ADD CONSTRAINT "waiting_list_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_agent_org_website_idx" ON "ai_agent" USING btree ("organization_id","website_id");--> statement-breakpoint
CREATE INDEX "ai_agent_active_idx" ON "ai_agent" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "ai_agent_deleted_at_idx" ON "ai_agent" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "api_key_key_idx" ON "api_key" USING btree ("key");--> statement-breakpoint
CREATE INDEX "api_key_org_idx" ON "api_key" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "api_key_active_idx" ON "api_key" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "api_key_test_idx" ON "api_key" USING btree ("is_test");--> statement-breakpoint
CREATE INDEX "api_key_expires_at_idx" ON "api_key" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "api_key_revoked_at_idx" ON "api_key" USING btree ("revoked_at");--> statement-breakpoint
CREATE INDEX "account_provider_idx" ON "account" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_token_expires_idx" ON "account" USING btree ("access_token_expires_at");--> statement-breakpoint
CREATE INDEX "invitation_org_idx" ON "invitation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "invitation_email_idx" ON "invitation" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitation_status_idx" ON "invitation" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invitation_expires_at_idx" ON "invitation" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "member_org_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_user_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_role_idx" ON "member" USING btree ("role");--> statement-breakpoint
CREATE INDEX "organization_slug_idx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_active_org_idx" ON "session" USING btree ("active_organization_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_banned_idx" ON "user" USING btree ("banned");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_expires_at_idx" ON "verification" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "conversation_org_idx" ON "conversation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversation_org_status_idx" ON "conversation" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "conversation_org_priority_idx" ON "conversation" USING btree ("organization_id","priority");--> statement-breakpoint
CREATE INDEX "conversation_website_status_idx" ON "conversation" USING btree ("website_id","status");--> statement-breakpoint
CREATE INDEX "conversation_visitor_idx" ON "conversation" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "conversation_org_team_member_idx" ON "conversation" USING btree ("organization_id","assigned_team_member_id");--> statement-breakpoint
CREATE INDEX "conversation_org_last_message_idx" ON "conversation" USING btree ("organization_id","last_message_at");--> statement-breakpoint
CREATE INDEX "conversation_deleted_at_idx" ON "conversation" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "message_org_idx" ON "message" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "message" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_org_conversation_idx" ON "message" USING btree ("organization_id","conversation_id");--> statement-breakpoint
CREATE INDEX "message_org_sender_idx" ON "message" USING btree ("organization_id","sender_id","sender_type");--> statement-breakpoint
CREATE INDEX "message_ai_agent_idx" ON "message" USING btree ("ai_agent_id");--> statement-breakpoint
CREATE INDEX "message_org_created_at_idx" ON "message" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "message_parent_idx" ON "message" USING btree ("parent_message_id");--> statement-breakpoint
CREATE INDEX "message_deleted_at_idx" ON "message" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "visitor_org_idx" ON "visitor" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "visitor_org_website_idx" ON "visitor" USING btree ("organization_id","website_id");--> statement-breakpoint
CREATE INDEX "visitor_website_idx" ON "visitor" USING btree ("website_id");--> statement-breakpoint
CREATE INDEX "visitor_user_idx" ON "visitor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "visitor_org_connected_idx" ON "visitor" USING btree ("organization_id","last_connected_at");--> statement-breakpoint
CREATE INDEX "visitor_deleted_at_idx" ON "visitor" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "visitor_identifier_website_idx" ON "visitor" USING btree ("identifier","website_id");--> statement-breakpoint
CREATE INDEX "website_org_status_idx" ON "website" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "website_deleted_at_idx" ON "website" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "website_slug_idx" ON "website" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "website_domain_idx" ON "website" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "website_org_domain_idx" ON "website" USING btree ("is_domain_ownership_verified","domain");