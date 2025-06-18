import { website } from "@repo/database";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  createWebsiteRequestSchema,
  createWebsiteResponseSchema,
} from "@api/schemas/website";
import { createDefaultWebsiteKeys } from "@api/db/queries/api-keys";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const websiteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createWebsiteRequestSchema)
    .output(createWebsiteResponseSchema)
    .mutation(async ({ ctx: { db, session, user }, input }) => {
      let slug = input.name.trim().toLowerCase().replace(/ /g, "-");

      // Check if website with same slug already exists
      const existingWebsite = await db.query.website.findFirst({
        where: eq(website.slug, slug),
      });

      // If website with same slug already exists, add a random suffix to the slug
      if (existingWebsite) {
        slug = `${slug}-${nanoid(4)}`;
      }

      const [createdWebsite] = await db
        .insert(website)
        .values({
          name: input.name,
          organizationId: input.organizationId,
          installationTarget: input.installationTarget,
          whitelistedDomains: [input.domain],
          slug,
        })
        .returning();

      const apiKeys = await createDefaultWebsiteKeys(db, {
        websiteId: createdWebsite.id,
        websiteName: input.name,
        organizationId: input.organizationId,
        createdBy: user.id,
      });

      return {
        ...createdWebsite,
        apiKeys,
      };
    }),
});
