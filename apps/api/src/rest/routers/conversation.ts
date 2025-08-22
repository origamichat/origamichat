import { getVisitor } from "@api/db/queries";
import {
	getConversationById,
	listConversations,
	upsertConversation,
} from "@api/db/queries/conversation";
import { sendMessages } from "@api/db/queries/message";
import {
	safelyExtractRequestData,
	safelyExtractRequestQuery,
	validateResponse,
} from "@api/utils/validate";
import {
	createConversationRequestSchema,
	createConversationResponseSchema,
	getConversationRequestSchema,
	getConversationResponseSchema,
	listConversationsRequestSchema,
	listConversationsResponseSchema,
} from "@cossistant/types/api/conversation";
import type { Message } from "@cossistant/types/schemas";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { protectedPublicApiKeyMiddleware } from "../middleware";
import type { RestContext } from "../types";

export const conversationRouter = new OpenAPIHono<RestContext>();

// Apply middleware to all routes in this router
conversationRouter.use("/*", ...protectedPublicApiKeyMiddleware);

conversationRouter.openapi(
	{
		method: "post",
		path: "/",
		summary: "Create a conversation with or without initial messages",
		description:
			"Create a conversation, accepts a conversation id or not and a set of default messages.",
		tags: ["Conversations"],
		request: {
			body: {
				required: true,
				content: {
					"application/json": {
						schema: createConversationRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Conversation created",
				content: {
					"application/json": {
						schema: createConversationResponseSchema,
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
				name: "X-Visitor-Id",
				in: "header",
				description: "Visitor ID from localStorage.",
				required: false,
				schema: {
					type: "string",
					pattern: "^[0-9A-HJKMNP-TV-Z]{26}$",
					example: "01JG000000000000000000000",
				},
			},
		],
	},
	async (c) => {
		const { db, website, organization, body, visitorIdHeader } =
			await safelyExtractRequestData(c, createConversationRequestSchema);

		const visitor = await getVisitor(db, {
			visitorId: body.visitorId || visitorIdHeader,
			externalVisitorId: body.externalVisitorId,
		});

		if (!visitor) {
			return c.json(
				{
					error:
						"Visitor not found, please pass a valid visitorId or externalVisitorId",
				},
				400
			);
		}

		const conversation = await upsertConversation(db, {
			organizationId: organization.id,
			websiteId: website.id,
			visitorId: visitor.id,
			conversationId: body.conversationId,
		});

		let initialMessages: Message[] = [];

		if (body.defaultMessages.length > 0) {
			initialMessages = await sendMessages(db, {
				organizationId: organization.id,
				websiteId: website.id,
				conversationId: conversation.id,
				messages: body.defaultMessages.map((msg) => ({
					...msg,
					type: msg.type ?? "text",
					visibility: msg.visibility ?? "public",
				})),
			});
		}

		return c.json(
			validateResponse(
				{
					initialMessages,
					conversation: {
						id: conversation.id,
						createdAt: conversation.createdAt,
						updatedAt: conversation.updatedAt,
						visitorId: conversation.visitorId,
						websiteId: conversation.websiteId,
						status: conversation.status,
					},
				},
				createConversationResponseSchema
			)
		);
	}
);

conversationRouter.openapi(
	{
		method: "get",
		path: "/",
		summary: "List conversations for a visitor",
		description:
			"Fetch paginated list of conversations for a specific visitor with optional filters.",
		tags: ["Conversations"],
		request: {
			query: listConversationsRequestSchema,
		},
		responses: {
			200: {
				description: "List of conversations retrieved successfully",
				content: {
					"application/json": {
						schema: listConversationsResponseSchema,
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
				name: "X-Visitor-Id",
				in: "header",
				description: "Visitor ID from localStorage.",
				required: false,
				schema: {
					type: "string",
					pattern: "^[0-9A-HJKMNP-TV-Z]{26}$",
					example: "01JG000000000000000000000",
				},
			},
		],
	},
	async (c) => {
		const { db, website, organization, query, visitorIdHeader } =
			await safelyExtractRequestQuery(c, listConversationsRequestSchema);

		const visitor = await getVisitor(db, {
			visitorId: query.visitorId || visitorIdHeader,
			externalVisitorId: query.externalVisitorId,
		});

		if (!visitor) {
			return c.json(
				{
					error:
						"Visitor not found, please pass a valid visitorId or externalVisitorId",
				},
				400
			);
		}

		const result = await listConversations(db, {
			organizationId: organization.id,
			websiteId: website.id,
			visitorId: visitor.id,
			page: query.page,
			limit: query.limit,
			status: query.status,
			orderBy: query.orderBy,
			order: query.order,
		});

		// Transform database response to match API schema
		const apiResponse = {
			conversations: result.conversations.map((conv) => ({
				id: conv.id,
				title: conv.title ?? undefined,
				createdAt: conv.createdAt,
				updatedAt: conv.updatedAt,
				visitorId: conv.visitorId,
				websiteId: conv.websiteId,
				status: conv.status,
			})),
			pagination: result.pagination,
		};

		return c.json(
			validateResponse(apiResponse, listConversationsResponseSchema)
		);
	}
);

conversationRouter.openapi(
	{
		method: "get",
		path: "/{conversationId}",
		summary: "Get a single conversation by ID",
		description: "Fetch a specific conversation by its ID.",
		tags: ["Conversations"],
		request: {
			params: getConversationRequestSchema,
		},
		responses: {
			200: {
				description: "Conversation retrieved successfully",
				content: {
					"application/json": {
						schema: getConversationResponseSchema,
					},
				},
			},
			404: {
				description: "Conversation not found",
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
		parameters: [
			{
				name: "conversationId",
				in: "path",
				description: "The ID of the conversation to retrieve",
				required: true,
				schema: {
					type: "string",
				},
			},
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
				name: "X-Visitor-Id",
				in: "header",
				description: "Visitor ID from localStorage.",
				required: false,
				schema: {
					type: "string",
					pattern: "^[0-9A-HJKMNP-TV-Z]{26}$",
					example: "01JG000000000000000000000",
				},
			},
		],
	},
	async (c) => {
		// Debug: Check what's in the context
		console.log("[DEBUG] GET /conversations/{id} - Context check:", {
			hasDb: !!c.get("db"),
			hasWebsite: !!c.get("website"),
			hasOrganization: !!c.get("organization"),
			hasApiKey: !!c.get("apiKey"),
			headers: {
				authorization: c.req.header("Authorization"),
				publicKey: c.req.header("X-Public-Key"),
				visitorId: c.req.header("X-Visitor-Id"),
			},
		});

		const { db, website, organization } = await safelyExtractRequestData(c);

		// Validate path params manually for now
		const params = getConversationRequestSchema.parse({
			conversationId: c.req.param("conversationId"),
		});

		const conversation = await getConversationById(db, {
			organizationId: organization.id,
			websiteId: website.id,
			conversationId: params.conversationId,
		});

		if (!conversation) {
			return c.json(
				{
					error: "Conversation not found",
				},
				404
			);
		}

		// Transform database response to match API schema
		const apiResponse = {
			conversation: {
				id: conversation.id,
				title: conversation.title ?? undefined,
				createdAt: conversation.createdAt,
				updatedAt: conversation.updatedAt,
				visitorId: conversation.visitorId,
				websiteId: conversation.websiteId,
				status: conversation.status,
			},
		};

		return c.json(validateResponse(apiResponse, getConversationResponseSchema));
	}
);
