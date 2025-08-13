import { z } from "@hono/zod-openapi";
import { MessageType } from "../enums";
import { ConversationSchema, MessageSchema } from "../schemas";

export const CreateMessageRequestSchema = z.object({
  content: z
    .string()
    .min(1)
    .openapi({ description: "Message content", example: "Hello there!" }),
  type: z
    .enum([MessageType.TEXT, MessageType.IMAGE, MessageType.FILE])
    .openapi({ description: "Message type", example: MessageType.TEXT }),
  userId: z.string().nullable().openapi({ description: "User ID" }),
  aiAgentId: z.string().nullable().openapi({ description: "AI Agent ID" }),
  visitorId: z.string().nullable().openapi({ description: "Visitor ID" }),
});

export const createConversationRequestSchema = z.object({
  messages: z.array(CreateMessageRequestSchema),
  conversationId: z.string().optional().openapi({ description: "Pre-" }),
  channel: z.string().optional().default("widget").openapi({
    description: "Channel, from where the conversation is created",
    example: "widget",
    default: "widget",
  }),
});

export type CreateConversationRequest = z.infer<
  typeof createConversationRequestSchema
>;

export const sendMessageRequestSchema = z
  .object({
    content: z
      .string()
      .min(1)
      .openapi({ description: "Message content", example: "Hello there!" }),
    type: z.enum([MessageType.TEXT, MessageType.IMAGE, MessageType.FILE]),
    userId: z.string().nullable(),
    aiAgentId: z.string().nullable(),
    visitorId: z.string().nullable(),
    conversationId: z
      .string()
      .openapi({ description: "Existing conversation id" }),
  })
  .openapi({
    description: "Body for sending a message.",
  });

export type SendMessageRequestBody = z.infer<typeof sendMessageRequestSchema>;

export const sendMessageResponseSchema = z
  .object({
    message: MessageSchema,
    conversation: ConversationSchema,
  })
  .openapi({ description: "Message + conversation after sending" });

export type SendMessageResponseBody = z.infer<typeof sendMessageResponseSchema>;
