ALTER TABLE "visitor" ALTER COLUMN "externalId" DROP NOT NULL;
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_externalId_unique" UNIQUE("externalId");