import { getConversationsByVisitor } from "@api/db/queries/conversation";
import { validateResponse } from "@api/utils/validate-response";
import {
	listConversationsQuerySchema,
	listConversationsResponseSchema,
} from "@cossistant/types";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import type { RestContext } from "../types";

export const conversationRouter = new OpenAPIHono<RestContext>();

conversationRouter.openapi(
	createRoute({
		method: "get",
		path: "/",
		summary: "List conversations for current visitor",
		request: {
			query: listConversationsQuerySchema,
		},
		responses: {
			200: {
				description: "Conversations list",
				content: {
					"application/json": {
						schema: listConversationsResponseSchema,
					},
				},
			},
			400: { description: "Bad Request" },
			404: { description: "Not Found" },
			500: { description: "Server Error" },
		},
		tags: ["Conversations"],
	}),
	async (c) => {
		const db = c.get("db");
		const website = c.get("website");

		if (!db) {
			return c.json({ error: "Database unavailable" }, 500);
		}
		if (!website) {
			return c.json({ error: "Website not found" }, 404);
		}

		const visitorId = c.req.header("X-Visitor-Id");
		if (!visitorId) {
			return c.json({ error: "Missing X-Visitor-Id header" }, 400);
		}

		const page = Number(c.req.query("page") ?? 1);
		const limit = Number(c.req.query("limit") ?? 20);

		const { items, total } = await getConversationsByVisitor(db, {
			websiteId: website.id,
			visitorId,
			page,
			limit,
		});

		return c.json(
			validateResponse(
				{
					conversations: items.map((it) => ({
						id: it.id,
						title: it.title ?? undefined,
						createdAt: it.createdAt,
						updatedAt: it.updatedAt,
						userId: visitorId,
						organizationId: it.organizationId,
						status: it.status,
						unreadCount: 0,
					})),
					pagination: {
						page,
						limit,
						total,
						hasMore: page * limit < total,
					},
				},
				listConversationsResponseSchema
			)
		);
	}
);
