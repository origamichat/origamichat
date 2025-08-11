import { z } from "@hono/zod-openapi";
import { ConversationSchema, MessageSchema } from "../schemas";

export const sendMessageRequestSchema = z
	.object({
		content: z
			.string()
			.min(1)
			.openapi({ description: "Message content", example: "Hello there!" }),
		conversationId: z
			.string()
			.optional()
			.openapi({ description: "Existing conversation id" }),
		metadata: z
			.record(z.unknown())
			.optional()
			.openapi({ description: "Optional metadata for the message" }),
	})
	.openapi({
		description:
			"Body for sending a message. If conversationId is omitted, a new conversation will be created.",
	});

export type SendMessageRequestBody = z.infer<typeof sendMessageRequestSchema>;

export const sendMessageResponseSchema = z
	.object({
		message: MessageSchema,
		conversation: ConversationSchema,
	})
	.openapi({ description: "Message + conversation after sending" });

export type SendMessageResponseBody = z.infer<typeof sendMessageResponseSchema>;
