import { website } from "@repo/database";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  checkWebsiteDomainRequestSchema,
  createWebsiteRequestSchema,
  createWebsiteResponseSchema,
} from "@api/schemas/website";
import { createDefaultWebsiteKeys } from "@api/db/queries/api-keys";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const websiteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createWebsiteRequestSchema)
    .output(createWebsiteResponseSchema)
    .mutation(async ({ ctx: { db, user }, input }) => {
      let slug = input.name.trim().toLowerCase().replace(/ /g, "-");

      // Check if website with same slug already exists
      const [existingSlugWebsite, existingDomainWebsite] = await Promise.all([
        db.query.website.findFirst({
          where: eq(website.slug, slug),
        }),
        db.query.website.findFirst({
          where: and(
            eq(website.domain, input.domain),
            eq(website.isDomainOwnershipVerified, true)
          ),
        }),
      ]);

      // If website with same slug already exists, add a random suffix to the slug
      if (existingSlugWebsite) {
        slug = `${slug}-${nanoid(4)}`;
      }

      // If website with same verified domain already exists, error, the user cannot use that domain
      if (existingDomainWebsite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Domain already in use by another website",
        });
      }

      const userEmailDomain = user.email.split("@")[1];

      // TODO: Add a better verification process for domain ownership
      // If the user's email domain is the same as the website domain, we can assume that the user owns the domain for now
      const isDomainOwnershipVerified = userEmailDomain === input.domain;

      const [createdWebsite] = await db
        .insert(website)
        .values({
          name: input.name,
          organizationId: input.organizationId,
          installationTarget: input.installationTarget,
          domain: input.domain,
          isDomainOwnershipVerified,
          whitelistedDomains: [
            `https://${input.domain}`,
            "http://localhost:3000",
          ],
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
  checkDomain: protectedProcedure
    .input(checkWebsiteDomainRequestSchema)
    .output(z.boolean())
    .query(async ({ ctx: { db }, input }) => {
      const existingWebsite = await db.query.website.findFirst({
        where: and(
          eq(website.domain, input.domain),
          eq(website.isDomainOwnershipVerified, true)
        ),
      });

      return !!existingWebsite;
    }),
});
