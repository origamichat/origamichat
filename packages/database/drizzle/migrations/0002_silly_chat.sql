ALTER TABLE "api_key" DROP CONSTRAINT "api_key_website_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "api_key" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_website_id_website_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."website"("id") ON DELETE cascade ON UPDATE no action;