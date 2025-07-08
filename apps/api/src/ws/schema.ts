import { z } from "zod";

// Message content schema for JSONB support
export const messageContentSchema = z.object({
	text: z.string().optional(),
	html: z.string().optional(),
	attachments: z
		.array(
			z.object({
				id: z.string(),
				url: z.string(),
				type: z.string(),
				name: z.string(),
				size: z.number().optional(),
			})
		)
		.optional(),
	metadata: z.record(z.unknown()).optional(),
});

// Client message types that can be sent to the server
export const clientMessageSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("ping"),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("subscribe_conversation"),
		conversationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("subscribe_website"),
		websiteId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("unsubscribe_conversation"),
		conversationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("unsubscribe_website"),
		websiteId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("typing_start"),
		conversationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("typing_stop"),
		conversationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("typing_progress"),
		conversationId: z.string(),
		content: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("send_message"),
		conversationId: z.string(),
		content: messageContentSchema,
		metadata: z.record(z.unknown()).optional(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;

// Server message types that can be sent to clients
export const serverMessageSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("pong"),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("connection_established"),
		connectionId: z.string(),
		serverTime: z.number(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("error"),
		error: z.string(),
		code: z.string().optional(),
		details: z.unknown().optional(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("reconnect"),
		reason: z.string(),
		retryAfter: z.number().optional(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("subscription_confirmed"),
		channel: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("subscription_error"),
		error: z.string(),
		channel: z.string().optional(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("new_message"),
		conversationId: z.string(),
		messageId: z.string(),
		content: messageContentSchema,
		senderType: z.enum(["visitor", "user", "ai_agent"]),
		senderId: z.string(),
		createdAt: z.string(),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("conversation_status_changed"),
		conversationId: z.string(),
		status: z.enum(["open", "pending", "resolved", "closed"]),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("conversation_assigned"),
		conversationId: z.string(),
		assignedTeamMemberId: z.string().nullable(),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("typing_indicator"),
		conversationId: z.string(),
		userId: z.string(),
		isTyping: z.boolean(),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("typing_progress"),
		conversationId: z.string(),
		userId: z.string(),
		userType: z.enum(["visitor", "user", "ai_agent"]),
		content: z.string(),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("visitor_online"),
		conversationId: z.string(),
		visitorId: z.string(),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
	z.object({
		type: z.literal("visitor_offline"),
		conversationId: z.string(),
		visitorId: z.string(),
		websiteId: z.string(),
		organizationId: z.string(),
		timestamp: z.number().optional(),
		id: z.string().optional(),
	}),
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;
