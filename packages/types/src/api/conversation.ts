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
