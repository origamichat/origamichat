/**
 * WebSocket message types and schemas for type-safe communication
 * between client and server. These types are shared across the entire
 * application to ensure consistency.
 */

import type { z } from "zod";

/**
 * Message content structure for chat messages
 * Supports various content types stored as JSONB in the database
 */
export interface MessageContent {
	/** Text content of the message */
	text?: string;
	/** HTML content (for rich text messages) */
	html?: string;
	/** Attachments (images, files, etc.) */
	attachments?: Array<{
		id: string;
		url: string;
		type: string;
		name: string;
		size?: number;
	}>;
	/** Custom metadata for the message */
	metadata?: Record<string, unknown>;
}

/**
 * Client-to-server message types
 */
export type ClientMessageType =
	| "ping"
	| "subscribe_conversation"
	| "subscribe_website"
	| "unsubscribe_conversation"
	| "unsubscribe_website"
	| "typing_start"
	| "typing_stop"
	| "typing_progress"
	| "send_message";

/**
 * Server-to-client message types
 */
export type ServerMessageType =
	| "pong"
	| "subscription_confirmed"
	| "subscription_error"
	| "new_message"
	| "conversation_status_changed"
	| "conversation_assigned"
	| "typing_indicator"
	| "typing_progress"
	| "visitor_online"
	| "visitor_offline"
	| "connection_established"
	| "error"
	| "reconnect";

/**
 * Base message structure
 */
export interface BaseMessage {
	type: string;
	timestamp?: number;
	id?: string;
}

/**
 * Client messages
 */
export interface ClientMessage extends BaseMessage {
	type: ClientMessageType;
}

export interface PingMessage extends ClientMessage {
	type: "ping";
}

export interface SubscribeConversationMessage extends ClientMessage {
	type: "subscribe_conversation";
	conversationId: string;
}

export interface SubscribeWebsiteMessage extends ClientMessage {
	type: "subscribe_website";
	websiteId: string;
}

export interface UnsubscribeConversationMessage extends ClientMessage {
	type: "unsubscribe_conversation";
	conversationId: string;
}

export interface UnsubscribeWebsiteMessage extends ClientMessage {
	type: "unsubscribe_website";
	websiteId: string;
}

export interface TypingStartMessage extends ClientMessage {
	type: "typing_start";
	conversationId: string;
}

export interface TypingStopMessage extends ClientMessage {
	type: "typing_stop";
	conversationId: string;
}

export interface TypingProgressMessage extends ClientMessage {
	type: "typing_progress";
	conversationId: string;
	content: string;
}

export interface SendMessageMessage extends ClientMessage {
	type: "send_message";
	conversationId: string;
	content: MessageContent;
	metadata?: Record<string, unknown>;
}

/**
 * Union type for all client messages
 */
export type ClientMessages =
	| PingMessage
	| SubscribeConversationMessage
	| SubscribeWebsiteMessage
	| UnsubscribeConversationMessage
	| UnsubscribeWebsiteMessage
	| TypingStartMessage
	| TypingStopMessage
	| TypingProgressMessage
	| SendMessageMessage;

/**
 * Server messages
 */
export interface ServerMessage extends BaseMessage {
	type: ServerMessageType;
}

export interface PongMessage extends ServerMessage {
	type: "pong";
}

export interface SubscriptionConfirmedMessage extends ServerMessage {
	type: "subscription_confirmed";
	channel: string;
}

export interface SubscriptionErrorMessage extends ServerMessage {
	type: "subscription_error";
	error: string;
	channel?: string;
}

export interface NewMessageMessage extends ServerMessage {
	type: "new_message";
	conversationId: string;
	messageId: string;
	content: MessageContent;
	senderType: "visitor" | "user" | "ai_agent";
	senderId: string;
	createdAt: string;
	websiteId: string;
	organizationId: string;
}

export interface ConversationStatusChangedMessage extends ServerMessage {
	type: "conversation_status_changed";
	conversationId: string;
	status: "open" | "pending" | "resolved" | "closed";
	websiteId: string;
	organizationId: string;
}

export interface ConversationAssignedMessage extends ServerMessage {
	type: "conversation_assigned";
	conversationId: string;
	assignedTeamMemberId: string | null;
	websiteId: string;
	organizationId: string;
}

export interface TypingIndicatorMessage extends ServerMessage {
	type: "typing_indicator";
	conversationId: string;
	userId: string;
	isTyping: boolean;
	websiteId: string;
	organizationId: string;
}

export interface TypingProgressServerMessage extends ServerMessage {
	type: "typing_progress";
	conversationId: string;
	userId: string;
	userType: "visitor" | "user" | "ai_agent";
	content: string;
	websiteId: string;
	organizationId: string;
}

export interface VisitorOnlineMessage extends ServerMessage {
	type: "visitor_online";
	conversationId: string;
	visitorId: string;
	websiteId: string;
	organizationId: string;
}

export interface VisitorOfflineMessage extends ServerMessage {
	type: "visitor_offline";
	conversationId: string;
	visitorId: string;
	websiteId: string;
	organizationId: string;
}

export interface ConnectionEstablishedMessage extends ServerMessage {
	type: "connection_established";
	connectionId: string;
	serverTime: number;
}

export interface ErrorMessage extends ServerMessage {
	type: "error";
	error: string;
	code?: string;
	details?: unknown;
}

export interface ReconnectMessage extends ServerMessage {
	type: "reconnect";
	reason: string;
	retryAfter?: number;
}

/**
 * Union type for all server messages
 */
export type ServerMessages =
	| PongMessage
	| SubscriptionConfirmedMessage
	| SubscriptionErrorMessage
	| NewMessageMessage
	| ConversationStatusChangedMessage
	| ConversationAssignedMessage
	| TypingIndicatorMessage
	| TypingProgressServerMessage
	| VisitorOnlineMessage
	| VisitorOfflineMessage
	| ConnectionEstablishedMessage
	| ErrorMessage
	| ReconnectMessage;

/**
 * WebSocket connection states
 */
export enum WebSocketState {
	CONNECTING = 0,
	OPEN = 1,
	CLOSING = 2,
	CLOSED = 3,
}

/**
 * WebSocket hook configuration options
 */
export interface WebSocketConfig {
	/** WebSocket URL to connect to */
	url?: string;
	/** Enable automatic reconnection (default: true) */
	autoReconnect?: boolean;
	/** Initial reconnect delay in ms (default: 1000) */
	reconnectDelay?: number;
	/** Maximum reconnect delay in ms (default: 30000) */
	maxReconnectDelay?: number;
	/** Reconnect delay multiplier (default: 1.5) */
	reconnectDelayMultiplier?: number;
	/** Maximum number of reconnect attempts (default: Infinity) */
	maxReconnectAttempts?: number;
	/** Enable message queuing when disconnected (default: true) */
	enableMessageQueue?: boolean;
	/** Maximum queue size (default: 100) */
	maxQueueSize?: number;
	/** Heartbeat interval in ms (default: 30000) */
	heartbeatInterval?: number;
	/** Request timeout in ms (default: 10000) */
	requestTimeout?: number;
	/** Enable debug logging (default: false) */
	debug?: boolean;
	/** Custom headers for WebSocket connection */
	headers?: Record<string, string>;
	/** Protocols for WebSocket connection */
	protocols?: string | string[];
	/** Throttle typing progress updates in ms (default: 100) */
	typingProgressThrottle?: number;
}

/**
 * WebSocket hook event handlers
 */
export interface WebSocketEventHandlers {
	/** Called when connection is established */
	onOpen?: (event: Event) => void;
	/** Called when connection is closed */
	onClose?: (event: CloseEvent) => void;
	/** Called when an error occurs */
	onError?: (event: Event) => void;
	/** Called when a message is received */
	onMessage?: (message: ServerMessages) => void;
	/** Called for specific message types */
	onNewMessage?: (message: NewMessageMessage) => void;
	onConversationStatusChange?: (
		message: ConversationStatusChangedMessage
	) => void;
	onConversationAssigned?: (message: ConversationAssignedMessage) => void;
	onTypingIndicator?: (message: TypingIndicatorMessage) => void;
	onTypingProgress?: (message: TypingProgressServerMessage) => void;
	onVisitorPresence?: (
		message: VisitorOnlineMessage | VisitorOfflineMessage
	) => void;
	/** Called when reconnecting */
	onReconnectAttempt?: (attemptNumber: number) => void;
	/** Called when reconnected successfully */
	onReconnectSuccess?: () => void;
	/** Called when reconnection fails */
	onReconnectFail?: () => void;
}

/**
 * WebSocket hook return type
 */
export interface UseAdvancedWebSocketReturn {
	/** Current connection state */
	readyState: WebSocketState;
	/** Whether the connection is open */
	isConnected: boolean;
	/** Whether the connection is connecting */
	isConnecting: boolean;
	/** Send a message to the server */
	sendMessage: (message: ClientMessages) => void;
	/** Subscribe to a conversation */
	subscribeToConversation: (conversationId: string) => void;
	/** Subscribe to a website (team members only) */
	subscribeToWebsite: (websiteId: string) => void;
	/** Unsubscribe from a conversation */
	unsubscribeFromConversation: (conversationId: string) => void;
	/** Unsubscribe from a website */
	unsubscribeFromWebsite: (websiteId: string) => void;
	/** Send typing start indicator */
	startTyping: (conversationId: string) => void;
	/** Send typing stop indicator */
	stopTyping: (conversationId: string) => void;
	/** Send typing progress (what user is currently typing) */
	sendTypingProgress: (conversationId: string, content: string) => void;
	/** Send a chat message */
	sendChatMessage: (
		conversationId: string,
		content: MessageContent,
		metadata?: Record<string, unknown>
	) => void;
	/** Manually connect to WebSocket */
	connect: () => void;
	/** Manually disconnect from WebSocket */
	disconnect: () => void;
	/** Send a ping to keep connection alive */
	ping: () => void;
	/** Get the underlying WebSocket instance */
	getWebSocket: () => WebSocket | null;
	/** Current subscriptions */
	subscriptions: string[];
	/** Number of queued messages */
	queuedMessageCount: number;
	/** Connection statistics */
	stats: {
		connectTime?: number;
		messagesSent: number;
		messagesReceived: number;
		reconnectAttempts: number;
		lastError?: string;
		lastErrorTime?: number;
	};
}

/**
 * Message queue item
 */
export interface QueuedMessage {
	message: ClientMessages;
	timestamp: number;
	attempts: number;
}

/**
 * Subscription state
 */
export interface SubscriptionState {
	conversations: Set<string>;
	websites: Set<string>;
}
