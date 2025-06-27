import { createDefaultWebsiteKeys } from "@api/db/queries/api-keys";
import {
	checkWebsiteDomainRequestSchema,
	createWebsiteRequestSchema,
	createWebsiteResponseSchema,
} from "@api/schemas/website";
import { website } from "@cossistant/database";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";

export const websiteRouter = createTRPCRouter({
	create: protectedProcedure
		.input(createWebsiteRequestSchema)
		.output(createWebsiteResponseSchema)
		.mutation(async ({ ctx: { db, user }, input }) => {
			// Check if website with same verified domain already exists
			const existingDomainWebsite = await db.query.website.findFirst({
				where: and(
					eq(website.domain, input.domain),
					eq(website.isDomainOwnershipVerified, true)
				),
			});

			if (existingDomainWebsite) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Domain already in use by another website",
				});
			}

			const userEmailDomain = user.email.split("@")[1];
			const isDomainOwnershipVerified = userEmailDomain === input.domain;

			// Generate a unique slug by always adding a random suffix
			const baseSlug = input.name.trim().toLowerCase().replace(/ /g, "-");
			const slug = `${baseSlug}-${nanoid(6)}`;

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
				id: createdWebsite.id,
				name: createdWebsite.name,
				whitelistedDomains: createdWebsite.whitelistedDomains,
				organizationId: createdWebsite.organizationId,
				apiKeys: apiKeys.map((key) => ({
					id: key.id,
					key: key.key,
					createdAt: key.createdAt,
					isTest: key.isTest,
					isActive: key.isActive,
					keyType: key.keyType,
				})),
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
