CREATE TYPE "public"."conversation_event_type" AS ENUM('ASSIGNED', 'UNASSIGNED', 'PARTICIPANT_REQUESTED', 'PARTICIPANT_JOINED', 'PARTICIPANT_LEFT', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'TAG_ADDED', 'TAG_REMOVED', 'RESOLVED', 'REOPENED');--> statement-breakpoint
CREATE TYPE "public"."conversation_participation_status" AS ENUM('REQUESTED', 'ACTIVE', 'LEFT', 'DECLINED');--> statement-breakpoint
CREATE TYPE "public"."message_visibility" AS ENUM('PUBLIC', 'PRIVATE_NOTE');--> statement-breakpoint
CREATE TYPE "public"."website_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "conversation_assignee" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"conversation_id" varchar(18) NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"assigned_by_user_id" varchar(26),
	"assigned_by_ai_agent_id" varchar(26),
	"assigned_at" timestamp NOT NULL,
	"unassigned_at" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_event" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"conversation_id" varchar(18) NOT NULL,
	"type" "conversation_event_type" NOT NULL,
	"actor_user_id" varchar(26),
	"actor_ai_agent_id" varchar(26),
	"target_user_id" varchar(26),
	"target_ai_agent_id" varchar(26),
	"message" text,
	"metadata" jsonb,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_participant" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"conversation_id" varchar(18) NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"status" "conversation_participation_status" DEFAULT 'ACTIVE' NOT NULL,
	"reason" text,
	"requested_by_user_id" varchar(26),
	"requested_by_ai_agent_id" varchar(26),
	"joined_at" timestamp NOT NULL,
	"left_at" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_read_receipt" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"conversation_id" varchar(18) NOT NULL,
	"user_id" varchar(26),
	"ai_agent_id" varchar(26),
	"last_read_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_tag" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"conversation_id" varchar(18) NOT NULL,
	"tag_id" varchar(26) NOT NULL,
	"added_by_user_id" varchar(26),
	"added_by_ai_agent_id" varchar(26),
	"created_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"prompt" text,
	"organization_id" varchar(26) NOT NULL,
	"website_id" varchar(26) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP INDEX "message_org_sender_idx";--> statement-breakpoint
ALTER TABLE "ai_agent" ALTER COLUMN "temperature" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "visitor" ALTER COLUMN "identifier" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "website" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."website_status";--> statement-breakpoint
ALTER TABLE "website" ALTER COLUMN "status" SET DATA TYPE "public"."website_status" USING "status"::"public"."website_status";--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "first_response_at" timestamp;--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "resolved_at" timestamp;--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "resolved_by_user_id" varchar(26);--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "resolved_by_ai_agent_id" varchar(26);--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "user_id" varchar(26);--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "visibility" "message_visibility" DEFAULT 'PUBLIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "conversation_assignee" ADD CONSTRAINT "conversation_assignee_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_assignee" ADD CONSTRAINT "conversation_assignee_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_assignee" ADD CONSTRAINT "conversation_assignee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_assignee" ADD CONSTRAINT "conversation_assignee_assigned_by_user_id_user_id_fk" FOREIGN KEY ("assigned_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_assignee" ADD CONSTRAINT "conversation_assignee_assigned_by_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("assigned_by_ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_event" ADD CONSTRAINT "conversation_event_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_event" ADD CONSTRAINT "conversation_event_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_event" ADD CONSTRAINT "conversation_event_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_event" ADD CONSTRAINT "conversation_event_actor_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("actor_ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_event" ADD CONSTRAINT "conversation_event_target_user_id_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_event" ADD CONSTRAINT "conversation_event_target_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("target_ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_requested_by_user_id_user_id_fk" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participant" ADD CONSTRAINT "conversation_participant_requested_by_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("requested_by_ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_read_receipt" ADD CONSTRAINT "conversation_read_receipt_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_read_receipt" ADD CONSTRAINT "conversation_read_receipt_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_read_receipt" ADD CONSTRAINT "conversation_read_receipt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_read_receipt" ADD CONSTRAINT "conversation_read_receipt_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_tag" ADD CONSTRAINT "conversation_tag_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_tag" ADD CONSTRAINT "conversation_tag_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_tag" ADD CONSTRAINT "conversation_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_tag" ADD CONSTRAINT "conversation_tag_added_by_user_id_user_id_fk" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_tag" ADD CONSTRAINT "conversation_tag_added_by_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("added_by_ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_assignee_org_idx" ON "conversation_assignee" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversation_assignee_conv_idx" ON "conversation_assignee" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conversation_assignee_user_idx" ON "conversation_assignee" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_assignee_unique" ON "conversation_assignee" USING btree ("conversation_id","user_id");--> statement-breakpoint
CREATE INDEX "conversation_event_org_idx" ON "conversation_event" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversation_event_conv_idx" ON "conversation_event" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conversation_event_type_idx" ON "conversation_event" USING btree ("type");--> statement-breakpoint
CREATE INDEX "conversation_participant_org_idx" ON "conversation_participant" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversation_participant_conv_idx" ON "conversation_participant" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conversation_participant_user_idx" ON "conversation_participant" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_participant_unique" ON "conversation_participant" USING btree ("conversation_id","user_id");--> statement-breakpoint
CREATE INDEX "conv_read_receipt_org_idx" ON "conversation_read_receipt" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conv_read_receipt_conv_idx" ON "conversation_read_receipt" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conv_read_receipt_user_idx" ON "conversation_read_receipt" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conv_read_receipt_ai_agent_idx" ON "conversation_read_receipt" USING btree ("ai_agent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conv_read_receipt_conv_user_unique" ON "conversation_read_receipt" USING btree ("conversation_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conv_read_receipt_conv_ai_agent_unique" ON "conversation_read_receipt" USING btree ("conversation_id","ai_agent_id");--> statement-breakpoint
CREATE INDEX "conversation_tag_org_idx" ON "conversation_tag" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversation_tag_conv_idx" ON "conversation_tag" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "conversation_tag_tag_idx" ON "conversation_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_tag_unique" ON "conversation_tag" USING btree ("conversation_id","tag_id");--> statement-breakpoint
CREATE INDEX "conversation_tag_deleted_at_idx" ON "conversation_tag" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "tag_org_idx" ON "tag" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "tag_website_idx" ON "tag" USING btree ("website_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_website_name_idx" ON "tag" USING btree ("website_id","name");--> statement-breakpoint
CREATE INDEX "tag_deleted_at_idx" ON "tag" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_resolved_by_user_id_user_id_fk" FOREIGN KEY ("resolved_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_resolved_by_ai_agent_id_ai_agent_id_fk" FOREIGN KEY ("resolved_by_ai_agent_id") REFERENCES "public"."ai_agent"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_org_resolved_idx" ON "conversation" USING btree ("organization_id","resolved_at");--> statement-breakpoint
CREATE INDEX "conversation_org_first_response_idx" ON "conversation" USING btree ("organization_id","first_response_at");--> statement-breakpoint
CREATE INDEX "message_org_user_idx" ON "message" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "message_visibility_idx" ON "message" USING btree ("visibility");--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "sender_type";--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "sender_id";--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "reactions";--> statement-breakpoint
DROP TYPE "public"."sender_type";