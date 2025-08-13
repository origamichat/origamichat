import type { Conversation, ConversationEvent, Message } from "./schemas";

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

// API Request/Response types
export interface SendMessageRequest {
  content: string;
  conversationId?: string;
  metadata?: Record<string, unknown>;
}

export interface SendMessageResponse {
  message: Message;
  conversation: Conversation;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface GetMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// WebSocket Event types
export interface WebSocketEvent {
  type: string;
  payload: unknown;
  timestamp: Date;
}

export interface MessageReceivedEvent extends WebSocketEvent {
  type: "message_received";
  payload: {
    message: Message;
    conversation: Conversation;
  };
}

export interface ConversationUpdatedEvent extends WebSocketEvent {
  type: "conversation_updated";
  payload: {
    conversation: Conversation;
  };
}

export interface TypingEvent extends WebSocketEvent {
  type: "typing";
  payload: {
    conversationId: string;
    isTyping: boolean;
  };
}

export type CossistantWebSocketEvent =
  | MessageReceivedEvent
  | ConversationUpdatedEvent
  | TypingEvent;

// Error types
export interface CossistantError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Event handler types
export type EventHandler<T = unknown> = (event: T) => void;

export interface EventHandlers {
  onMessage?: EventHandler<MessageReceivedEvent>;
  onConversationUpdate?: EventHandler<ConversationUpdatedEvent>;
  onTyping?: EventHandler<TypingEvent>;
  onConnect?: EventHandler<void>;
  onDisconnect?: EventHandler<void>;
  onError?: EventHandler<CossistantError>;
}
