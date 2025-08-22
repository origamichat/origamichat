import { z } from "@hono/zod-openapi";
import { ConversationSchema, MessageSchema } from "../schemas";
import { createMessageSchema } from "./messages";

export const createConversationRequestSchema = z
	.object({
		visitorId: z.string().optional().openapi({
			description:
				"Visitor ID, if not provided you must provide an externalVisitorId.",
		}),
		externalVisitorId: z.string().optional().openapi({
			description:
				"External ID the visitor has been identified with, if not provided you must provide a visitorId.",
		}),
		conversationId: z.string().optional().openapi({
			description:
				"Default conversation ID, if not provided the ID will be automatically generated.",
		}),
		defaultMessages: z.array(createMessageSchema).openapi({
			description: "Default messages to initiate the conversation with",
		}),
		channel: z.string().default("widget").openapi({
			description: "Which channel the conversation is from",
			default: "widget",
		}),
	})
	.refine((data) => Boolean(data.visitorId || data.externalVisitorId), {
		message: "Either visitorId or externalVisitorId must be provided",
		path: ["visitorId"],
	})
	.openapi({
		description: "Body for creating a conversation.",
	});

export type CreateConversationRequestBody = z.infer<
	typeof createConversationRequestSchema
>;

export const createConversationResponseSchema = z
	.object({
		initialMessages: z.array(MessageSchema),
		conversation: ConversationSchema,
	})
	.openapi({
		description: "Body including created conversation and default messages",
	});

export type CreateConversationResponseBody = z.infer<
	typeof createConversationResponseSchema
>;

export const listConversationsRequestSchema = z
	.object({
		visitorId: z.string().optional().openapi({
			description:
				"Visitor ID to fetch conversations for. If not provided, must provide externalVisitorId.",
		}),
		externalVisitorId: z.string().optional().openapi({
			description:
				"External visitor ID to fetch conversations for. If not provided, must provide visitorId.",
		}),
		page: z.coerce.number().min(1).default(1).openapi({
			description: "Page number for pagination",
			default: 1,
		}),
		limit: z.coerce.number().min(1).max(100).default(6).openapi({
			description: "Number of conversations per page",
			default: 6,
		}),
		status: z.enum(["open", "closed"]).optional().openapi({
			description: "Filter by conversation status",
		}),
		orderBy: z.enum(["createdAt", "updatedAt"]).default("updatedAt").openapi({
			description: "Field to order conversations by",
			default: "updatedAt",
		}),
		order: z.enum(["asc", "desc"]).default("desc").openapi({
			description: "Order direction",
			default: "desc",
		}),
	})
	.refine((data) => Boolean(data.visitorId || data.externalVisitorId), {
		message: "Either visitorId or externalVisitorId must be provided",
		path: ["visitorId"],
	})
	.openapi({
		description: "Query parameters for listing conversations",
	});

export type ListConversationsRequest = z.infer<
	typeof listConversationsRequestSchema
>;

export const listConversationsResponseSchema = z
	.object({
		conversations: z.array(ConversationSchema),
		pagination: z.object({
			page: z.number(),
			limit: z.number(),
			total: z.number(),
			totalPages: z.number(),
			hasMore: z.boolean(),
		}),
	})
	.openapi({
		description: "Paginated list of conversations",
	});

export type ListConversationsResponse = z.infer<
	typeof listConversationsResponseSchema
>;

export const getConversationRequestSchema = z
	.object({
		conversationId: z.string().openapi({
			description: "The ID of the conversation to retrieve",
		}),
	})
	.openapi({
		description: "Parameters for retrieving a single conversation",
	});

export type GetConversationRequest = z.infer<
	typeof getConversationRequestSchema
>;

export const getConversationResponseSchema = z
	.object({
		conversation: ConversationSchema,
	})
	.openapi({
		description: "Response containing a single conversation",
	});

export type GetConversationResponse = z.infer<
	typeof getConversationResponseSchema
>;
