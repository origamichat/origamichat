import {
	appendVisitorMessage,
	createConversationAndMessage,
} from "@api/db/queries";
import { validateResponse } from "@api/utils/validate-response";
import {
	type SendMessageRequestBody,
	sendMessageRequestSchema,
	sendMessageResponseSchema,
} from "@cossistant/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import type { RestContext } from "../types";

export const messagesRouter = new OpenAPIHono<RestContext>();

messagesRouter.openapi(
	{
		method: "post",
		path: "/",
		summary: "Send a message (create conversation if needed)",
		description:
			"Sends a visitor message. If conversationId is not provided, a new conversation is created and returned.",
		tags: ["Messages"],
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: sendMessageRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Message created",
				content: {
					"application/json": {
						schema: sendMessageResponseSchema,
					},
				},
			},
			400: {
				description: "Invalid request",
				content: {
					"application/json": {
						schema: z.object({ error: z.string() }),
					},
				},
			},
		},
		security: [
			{
				"Public API Key": [],
			},
			{
				"Private API Key": [],
			},
		],
	},
	async (c) => {
		const db = c.get("db");
		const website = c.get("website");
		const organization = c.get("organization");

		if (!db) {
			return c.json({ error: "Database unavailable" }, 500);
		}
		if (!website) {
			return c.json({ error: "Website not found" }, 404);
		}
		if (!organization) {
			return c.json({ error: "Organization not found" }, 404);
		}

		const body = (await c.req.json()) as SendMessageRequestBody;

		// Basic validation using zod schema (in addition to OpenAPI validation)
		const parse = sendMessageRequestSchema.safeParse(body);
		if (!parse.success) {
			return c.json({ error: "Invalid request" }, 400);
		}

		const visitorId = c.req.header("X-Visitor-Id");
		if (!visitorId) {
			return c.json({ error: "Missing X-Visitor-Id header" }, 400);
		}

		if (!body.conversationId) {
			const result = await createConversationAndMessage(db, {
				organizationId: organization.id,
				websiteId: website.id,
				visitorId,
				content: body.content,
				metadata: body.metadata ?? null,
			});

			return c.json(
				validateResponse(
					{
						message: {
							id: result.message.id,
							content:
								typeof body.content === "string"
									? body.content
									: JSON.stringify(body.content),
							timestamp: result.message.createdAt,
							sender: "visitor",
							conversationId: result.conversation.id,
						},
						conversation: {
							id: result.conversation.id,
							title: result.conversation.title ?? undefined,
							createdAt: result.conversation.createdAt,
							updatedAt: result.conversation.updatedAt,
							userId: visitorId,
							organizationId: result.conversation.organizationId,
							status: result.conversation.status,
							unreadCount: 0,
						},
					},
					sendMessageResponseSchema
				)
			);
		}

		// Append to existing conversation
		const newMessage = await appendVisitorMessage(db, {
			conversationId: body.conversationId,
			organizationId: organization.id,
			content: body.content,
			metadata: body.metadata ?? null,
		});

		return c.json(
			validateResponse(
				{
					message: {
						id: newMessage.id,
						content:
							typeof body.content === "string"
								? body.content
								: JSON.stringify(body.content),
						timestamp: newMessage.createdAt,
						sender: "visitor",
						conversationId: body.conversationId,
					},
					conversation: {
						id: body.conversationId,
						title: undefined,
						createdAt: new Date(),
						updatedAt: new Date(),
						userId: visitorId,
						organizationId: organization.id,
						status: "open",
						unreadCount: 0,
					},
				},
				sendMessageResponseSchema
			)
		);
	}
);
