import { z } from "zod";

// Export all enums
export * from "./enums";

import { ConversationStatus, SenderType } from "./enums";

// Export all API schemas and types
export * from "./api";

// Configuration types
export interface CossistantConfig {
	apiUrl: string;
	wsUrl: string;
	apiKey?: string; // Now optional since we're using public key
	publicKey?: string;
	userId?: string;
	organizationId?: string;
}

// Message types
export const MessageSchema = z.object({
	id: z.string(),
	content: z.string(),
	timestamp: z.date(),
	sender: z.enum([SenderType.VISITOR, SenderType.TEAM_MEMBER, SenderType.AI]),
	conversationId: z.string(),
	metadata: z.record(z.unknown()).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// Conversation types
export const ConversationSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	userId: z.string(),
	organizationId: z.string().optional(),
	status: z
		.enum([
			ConversationStatus.OPEN,
			ConversationStatus.RESOLVED,
			ConversationStatus.BLOCKED,
			ConversationStatus.PENDING,
		])
		.default(ConversationStatus.OPEN),
	unreadCount: z.number().default(0),
	lastMessage: MessageSchema.optional(),
});

export type Conversation = z.infer<typeof ConversationSchema>;

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
