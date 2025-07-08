/**
 * WebSocket module exports
 *
 * This module provides a complete WebSocket solution for real-time communication
 * with type safety, automatic reconnection, and message queuing.
 */

export type { WebSocketProviderProps } from "./provider";

// Context provider and hooks
export {
	useWebSocket,
	useWebSocketDirect,
	WebSocketProvider,
} from "./provider";

// Re-export common types for convenience
export type {
	ClientMessages,
	MessageContent,
	ServerMessages,
	UseAdvancedWebSocketReturn,
	WebSocketConfig,
	WebSocketEventHandlers,
} from "./types";

// Types
export * from "./types";

// Main hook
export { useAdvancedWebSocket } from "./use-advanced-websocket";
