ALTER TABLE "organization" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "website" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX "website_slug_idx" ON "website" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "website" ADD CONSTRAINT "website_slug_unique" UNIQUE("slug");