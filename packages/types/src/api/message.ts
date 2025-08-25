import { z } from "zod";
import { messageSchema } from "../schemas";

// GET /messages request
export const getMessagesRequestSchema = z.object({
  conversationId: z.string().min(1),
  limit: z.coerce.number().min(1).max(100).default(50).optional(),
  cursor: z.string().optional(),
});

export type GetMessagesRequest = z.infer<typeof getMessagesRequestSchema>;

// GET /messages response
export const getMessagesResponseSchema = z.object({
  messages: z.array(messageSchema),
  nextCursor: z.string().optional(),
  hasNextPage: z.boolean(),
});

export type GetMessagesResponse = z.infer<typeof getMessagesResponseSchema>;

// POST /messages request
export const sendMessageRequestSchema = z.object({
  conversationId: z.string().min(1),
  message: z.object({
    id: z.string().optional(),
    bodyMd: z.string(),
    type: z.enum(["text", "markdown", "image", "file"]).default("text"),
    userId: z.string().nullable().optional(),
    visitorId: z.string().nullable().optional(),
    aiAgentId: z.string().nullable().optional(),
    visibility: z.enum(["public", "private"]).default("public"),
    createdAt: z.date().optional(),
  }),
});

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

// POST /messages response
export const sendMessageResponseSchema = z.object({
  message: messageSchema,
});

export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;
