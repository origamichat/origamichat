/**
 * WebSocket Context Provider
 *
 * Provides WebSocket functionality to the entire application
 * through React Context API
 */

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type {
	UseAdvancedWebSocketReturn,
	WebSocketConfig,
	WebSocketEventHandlers,
} from "./types";
import { useAdvancedWebSocket } from "./use-advanced-websocket";

/**
 * WebSocket context type
 */
export type WebSocketContextType = UseAdvancedWebSocketReturn;

/**
 * WebSocket context
 */
const WebSocketContext = createContext<WebSocketContextType | null>(null);

/**
 * WebSocket provider props
 */
export interface WebSocketProviderProps {
	children: ReactNode;
	config?: WebSocketConfig;
	handlers?: WebSocketEventHandlers;
}

/**
 * WebSocket provider component
 *
 * @example
 * ```tsx
 * <WebSocketProvider
 *   config={{
 *     url: "wss://api.example.com/ws",
 *     autoReconnect: true,
 *     debug: process.env.NODE_ENV === "development",
 *   }}
 *   handlers={{
 *     onNewMessage: (message) => {
 *       console.log("New message:", message);
 *     },
 *     onTypingProgress: (message) => {
 *       console.log("Someone is typing:", message);
 *     },
 *   }}
 * >
 *   <App />
 * </WebSocketProvider>
 * ```
 */
export function WebSocketProvider({
	children,
	config,
	handlers,
}: WebSocketProviderProps) {
	const websocket = useAdvancedWebSocket(config, handlers);

	// Memoize context value to prevent unnecessary re-renders
	const contextValue = useMemo(() => websocket, [websocket]);

	return (
		<WebSocketContext.Provider value={contextValue}>
			{children}
		</WebSocketContext.Provider>
	);
}

/**
 * Hook to use WebSocket context
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const {
 *     isConnected,
 *     sendChatMessage,
 *     subscribeToConversation,
 *     startTyping,
 *     sendTypingProgress,
 *   } = useWebSocket();
 *
 *   // Use WebSocket functionality
 * }
 * ```
 */
export function useWebSocket(): WebSocketContextType {
	const context = useContext(WebSocketContext);

	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}

	return context;
}

/**
 * Hook to use WebSocket with inline config (for standalone usage)
 *
 * @example
 * ```tsx
 * function StandaloneComponent() {
 *   const websocket = useWebSocketDirect({
 *     config: { url: "wss://api.example.com/ws" },
 *     handlers: {
 *       onNewMessage: (message) => {
 *         console.log("New message:", message);
 *       },
 *     },
 *   });
 * }
 * ```
 */
export function useWebSocketDirect(
	options: { config?: WebSocketConfig; handlers?: WebSocketEventHandlers } = {}
): UseAdvancedWebSocketReturn {
	return useAdvancedWebSocket(options.config, options.handlers);
}
