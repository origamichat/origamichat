// Main client exports

// Type exports from shared types package
export type {
	Conversation,
	ConversationUpdatedEvent,
	CossistantConfig,
	CossistantError,
	CossistantWebSocketEvent,
	EventHandler,
	EventHandlers,
	GetConversationsResponse,
	GetMessagesResponse,
	Message,
	MessageReceivedEvent,
	PublicWebsiteResponse,
	SendMessageRequest,
	SendMessageResponse,
	TypingEvent,
	WebSocketEvent,
} from "@cossistant/types";

// Schema exports for runtime validation
export { ConversationSchema, MessageSchema } from "@cossistant/types";
export { CossistantClient, CossistantClient as default } from "./client";
export { CossistantRestClient } from "./rest-client";
// Core-specific exports
export { CossistantAPIError } from "./types";
// Utility exports
export {
	createClientWithDefaults,
	createConversationMessage,
	createMessageContent,
	DataFetcher,
	filterConversationsByStatus,
	formatMessageTimestamp,
	getLastMessage,
	getTotalUnreadCount,
	isMessageFromAssistant,
	isMessageFromUser,
	sortConversationsByUpdatedAt,
	sortMessagesByTimestamp,
} from "./utils";
export {
	clearAllVisitorIds,
	clearVisitorId,
	getVisitorId,
	setVisitorId,
} from "./visitor-tracker";
export {
	CossistantWebSocketClient,
	type CossistantWebSocketConfig,
	type WebSocketEventHandlers,
} from "./websocket-client";
