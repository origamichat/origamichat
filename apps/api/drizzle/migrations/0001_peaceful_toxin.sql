ALTER TABLE "conversation" ALTER COLUMN "id" SET DATA TYPE varchar(18);--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "conversation_id" SET DATA TYPE varchar(18);