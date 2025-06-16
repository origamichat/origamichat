CREATE TYPE "public"."website_installation_target" AS ENUM('nextjs', 'react');--> statement-breakpoint
DROP INDEX "conversation_team_member_idx";--> statement-breakpoint
DROP INDEX "conversation_last_message_idx";--> statement-breakpoint
DROP INDEX "message_sender_idx";--> statement-breakpoint
DROP INDEX "message_created_at_idx";--> statement-breakpoint
DROP INDEX "visitor_last_connected_idx";--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "visitor" ADD COLUMN "organization_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "website" ADD COLUMN "installation_target" "website_installation_target" NOT NULL;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_org_idx" ON "conversation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversation_org_status_idx" ON "conversation" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "conversation_org_priority_idx" ON "conversation" USING btree ("organization_id","priority");--> statement-breakpoint
CREATE INDEX "conversation_org_team_member_idx" ON "conversation" USING btree ("organization_id","assigned_team_member_id");--> statement-breakpoint
CREATE INDEX "conversation_org_last_message_idx" ON "conversation" USING btree ("organization_id","last_message_at");--> statement-breakpoint
CREATE INDEX "message_org_idx" ON "message" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "message_org_conversation_idx" ON "message" USING btree ("organization_id","conversation_id");--> statement-breakpoint
CREATE INDEX "message_org_sender_idx" ON "message" USING btree ("organization_id","sender_id","sender_type");--> statement-breakpoint
CREATE INDEX "message_org_created_at_idx" ON "message" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "message_parent_idx" ON "message" USING btree ("parent_message_id");--> statement-breakpoint
CREATE INDEX "visitor_org_idx" ON "visitor" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "visitor_org_website_idx" ON "visitor" USING btree ("organization_id","website_id");--> statement-breakpoint
CREATE INDEX "visitor_org_connected_idx" ON "visitor" USING btree ("organization_id","last_connected_at");