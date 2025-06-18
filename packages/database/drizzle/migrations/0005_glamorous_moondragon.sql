ALTER TABLE "website" ADD COLUMN "domain" text NOT NULL;--> statement-breakpoint
ALTER TABLE "website" ADD COLUMN "is_domain_ownership_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "website_domain_idx" ON "website" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "website_org_domain_idx" ON "website" USING btree ("is_domain_ownership_verified","domain");