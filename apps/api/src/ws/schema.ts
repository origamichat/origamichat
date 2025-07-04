import { z } from "zod";

// Client message types that can be sent to the server
export const clientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ping"),
  }),
  z.object({
    type: z.literal("subscribe_conversation"),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal("subscribe_website"),
    websiteId: z.string(),
  }),
  z.object({
    type: z.literal("unsubscribe_conversation"),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal("unsubscribe_website"),
    websiteId: z.string(),
  }),
  z.object({
    type: z.literal("typing_start"),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal("typing_stop"),
    conversationId: z.string(),
  }),
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;

// Server message types that can be sent to clients
export const serverMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("pong"),
  }),
  z.object({
    type: z.literal("subscription_confirmed"),
    channel: z.string(),
  }),
  z.object({
    type: z.literal("subscription_error"),
    error: z.string(),
    channel: z.string().optional(),
  }),
  z.object({
    type: z.literal("new_message"),
    conversationId: z.string(),
    messageId: z.string(),
    content: z.any(),
    senderType: z.enum(["visitor", "user", "ai_agent"]),
    senderId: z.string(),
    createdAt: z.string(),
    websiteId: z.string(),
    organizationId: z.string(),
  }),
  z.object({
    type: z.literal("conversation_status_changed"),
    conversationId: z.string(),
    status: z.enum(["open", "pending", "resolved", "closed"]),
    websiteId: z.string(),
    organizationId: z.string(),
  }),
  z.object({
    type: z.literal("conversation_assigned"),
    conversationId: z.string(),
    assignedTeamMemberId: z.string().nullable(),
    websiteId: z.string(),
    organizationId: z.string(),
  }),
  z.object({
    type: z.literal("typing_indicator"),
    conversationId: z.string(),
    userId: z.string(),
    isTyping: z.boolean(),
    websiteId: z.string(),
    organizationId: z.string(),
  }),
  z.object({
    type: z.literal("visitor_online"),
    conversationId: z.string(),
    visitorId: z.string(),
    websiteId: z.string(),
    organizationId: z.string(),
  }),
  z.object({
    type: z.literal("visitor_offline"),
    conversationId: z.string(),
    visitorId: z.string(),
    websiteId: z.string(),
    organizationId: z.string(),
  }),
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;
