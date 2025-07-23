import { member, organization } from "@api/db/schema/auth";
import { publicWebsiteResponseSchema } from "@cossistant/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import type { RestContext } from "../types";

export const websiteRouter = new OpenAPIHono<RestContext>();

// GET /website - Get website information linked to the API key
websiteRouter.openapi(
	{
		method: "get",
		path: "/",
		summary: "Get website information",
		description:
			"Returns the website information associated with the provided API key. This endpoint supports both public and private API keys with different authentication methods.",
		security: [
			{
				"Public API Key": [],
			},
			{
				"Private API Key": [],
			},
		],
		parameters: [
			{
				name: "Authorization",
				in: "header",
				description:
					"Private API key in Bearer token format. Use this for server-to-server authentication. Format: `Bearer sk_[live|test]_...`",
				required: false,
				schema: {
					type: "string",
					pattern: "^Bearer sk_(live|test)_[a-f0-9]{64}$",
					example:
						"Bearer sk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
				},
			},
			{
				name: "X-Public-Key",
				in: "header",
				description:
					"Public API key for browser-based authentication. Can only be used from whitelisted domains. Format: `pk_[live|test]_...`",
				required: false,
				schema: {
					type: "string",
					pattern: "^pk_(live|test)_[a-f0-9]{64}$",
					example:
						"pk_test_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
				},
			},
			{
				name: "Origin",
				in: "header",
				description:
					"Required when using public API keys. Must match one of the whitelisted domains for the website. Automatically set by browsers.",
				required: false,
				schema: {
					type: "string",
					format: "uri",
					example: "https://example.com",
				},
			},
		],
		responses: {
			200: {
				description: "Website information successfully retrieved",
				content: {
					"application/json": {
						schema: publicWebsiteResponseSchema,
					},
				},
			},
			401: {
				description: "Unauthorized - Invalid or missing API key",
				content: {
					"application/json": {
						schema: z.object({
							error: z.string(),
						}),
					},
				},
			},
			403: {
				description:
					"Forbidden - Origin validation failed for public key or domain not whitelisted",
				content: {
					"application/json": {
						schema: z.object({
							error: z.string(),
						}),
					},
				},
			},
			404: {
				description: "Website not found for this API key",
				content: {
					"application/json": {
						schema: z.object({
							error: z.string(),
						}),
					},
				},
			},
		},
		tags: ["Website"],
	},
	async (c) => {
		const website = c.get("website");
		const db = c.get("db");

		if (!website) {
			return c.json({ error: "Website not found for this API key" }, 404);
		}

		console.log("website", website);

		// Get the organisation admin and owners, they have access to the website
		// TODO: also get the team members associated with the website (they have access to the website)
		const organizationMembers = await db.query.member.findMany({
			where: and(
				eq(member.organizationId, website.organizationId),
				or(eq(member.role, "admin"), eq(member.role, "owner"))
			),
			with: {
				user: true,
			},
		});

		const availableAgents = organizationMembers.map((agent) => ({
			id: agent.id,
			name: agent.user.name,
			email: agent.user.email,
			image: agent.user.image,
			lastOnlineAt: new Date().toISOString(),
		}));

		// iso string indicating support activity
		const lastOnlineAt = new Date().toISOString();

		return c.json(
			{
				id: website.id,
				name: website.name,
				slug: website.slug,
				domain: website.domain,
				description: website.description,
				logoUrl: website.logoUrl,
				organizationId: website.organizationId,
				status: website.status,
				lastOnlineAt,
				availableAgents,
			},
			200
		);
	}
);
