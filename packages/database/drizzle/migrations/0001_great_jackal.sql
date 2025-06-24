CREATE TABLE "waiting_list_entry" (
	"id" "ulid" PRIMARY KEY NOT NULL,
	"user_id" "ulid" NOT NULL,
	"from_referral_code" text,
	"unique_referral_code" text NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "waiting_list_entry_unique_referral_code_unique" UNIQUE("unique_referral_code")
);
--> statement-breakpoint
ALTER TABLE "waiting_list_entry" ADD CONSTRAINT "waiting_list_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;