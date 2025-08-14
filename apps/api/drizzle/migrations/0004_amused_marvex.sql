ALTER TABLE "conversation_read_receipt" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "conversation_read_receipt" CASCADE;--> statement-breakpoint
ALTER TABLE "message" RENAME COLUMN "content" TO "body_md";--> statement-breakpoint
ALTER TABLE "visitor" RENAME COLUMN "identifier" TO "externalId";--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_assigned_team_member_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "conversation_event" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."conversation_event_type";--> statement-breakpoint
CREATE TYPE "public"."conversation_event_type" AS ENUM('assigned', 'unassigned', 'participant_requested', 'participant_joined', 'participant_left', 'status_changed', 'priority_changed', 'tag_added', 'tag_removed', 'resolved', 'reopened');--> statement-breakpoint
ALTER TABLE "conversation_event" ALTER COLUMN "type" SET DATA TYPE "public"."conversation_event_type" USING "type"::"public"."conversation_event_type";--> statement-breakpoint
ALTER TABLE "conversation_participant" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "conversation_participant" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."conversation_participation_status";--> statement-breakpoint
CREATE TYPE "public"."conversation_participation_status" AS ENUM('requested', 'active', 'left', 'declined');--> statement-breakpoint
ALTER TABLE "conversation_participant" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."conversation_participation_status";--> statement-breakpoint
ALTER TABLE "conversation_participant" ALTER COLUMN "status" SET DATA TYPE "public"."conversation_participation_status" USING "status"::"public"."conversation_participation_status";--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "visibility" SET DEFAULT 'public'::text;--> statement-breakpoint
DROP TYPE "public"."message_visibility";--> statement-breakpoint
CREATE TYPE "public"."message_visibility" AS ENUM('public', 'private');--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "visibility" SET DEFAULT 'public'::"public"."message_visibility";--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "visibility" SET DATA TYPE "public"."message_visibility" USING "visibility"::"public"."message_visibility";--> statement-breakpoint
DROP INDEX "conversation_org_team_member_idx";--> statement-breakpoint
DROP INDEX "conversation_org_last_message_idx";--> statement-breakpoint
DROP INDEX "visitor_identifier_website_idx";--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "channel" text DEFAULT 'widget' NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "mentions_index" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "visitor_id" varchar(26);--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_visitor_id_visitor_id_fk" FOREIGN KEY ("visitor_id") REFERENCES "public"."visitor"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "visitor_external_id_website_idx" ON "visitor" USING btree ("externalId","website_id");--> statement-breakpoint
ALTER TABLE "conversation" DROP COLUMN "assigned_team_member_id";--> statement-breakpoint
ALTER TABLE "conversation" DROP COLUMN "read_by";--> statement-breakpoint
ALTER TABLE "conversation" DROP COLUMN "last_read_at";--> statement-breakpoint
ALTER TABLE "conversation" DROP COLUMN "last_message_at";--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "metadata";--> statement-breakpoint
ALTER TABLE "visitor" DROP COLUMN "phone";