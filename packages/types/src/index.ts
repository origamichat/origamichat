// Export all API schemas and types
export * from "./api";
// Export all enums
export * from "./enums";
// Export realtime event types
export * from "./realtime-events";
export type { Conversation, ConversationEvent, Message } from "./schemas";
// Export shared schemas to avoid circular init order issues
export {
  ConversationEventSchema,
  ConversationSchema,
  MessageSchema,
} from "./schemas";

// Configuration types
export interface CossistantConfig {
  apiUrl: string;
  wsUrl: string;
  apiKey?: string;
  publicKey?: string;
  userId?: string;
  organizationId?: string;
}

export interface CossistantError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
