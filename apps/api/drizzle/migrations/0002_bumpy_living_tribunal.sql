CREATE TABLE "team" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" varchar(26) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teamMember" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"team_id" varchar(26) NOT NULL,
	"user_id" varchar(26) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "team_id" varchar(26);--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_team_id" varchar(26);--> statement-breakpoint
ALTER TABLE "website" ADD COLUMN "team_id" varchar(26) NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamMember" ADD CONSTRAINT "teamMember_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "team_org_idx" ON "team" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "team_org_name_idx" ON "team" USING btree ("organization_id","name");--> statement-breakpoint
CREATE INDEX "team_member_team_idx" ON "teamMember" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_member_user_idx" ON "teamMember" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitation_team_idx" ON "invitation" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "session_active_team_idx" ON "session" USING btree ("active_team_id");--> statement-breakpoint
CREATE INDEX "website_team_idx" ON "website" USING btree ("team_id");