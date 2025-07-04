"use client";

import type { ClientMessage, ServerMessage } from "@api/ws/schema";
import { serverMessageSchema } from "@api/ws/schema";
import { useCallback, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getWebSocketUrl } from "@/lib/url";

export interface WebSocketMessage {
	type: string;
	[key: string]: unknown;
}

export interface UseWebSocketOptions {
	onMessage?: (message: ServerMessage) => void;
	onNewMessage?: (
		message: Extract<ServerMessage, { type: "new_message" }>
	) => void;
	onConversationStatusChange?: (
		message: Extract<ServerMessage, { type: "conversation_status_changed" }>
	) => void;
	onTypingIndicator?: (
		message: Extract<ServerMessage, { type: "typing_indicator" }>
	) => void;
	onVisitorPresence?: (
		message: Extract<
			ServerMessage,
			{ type: "visitor_online" | "visitor_offline" }
		>
	) => void;
	shouldReconnect?: boolean;
}

export function useAdvancedWebSocket(options: UseWebSocketOptions = {}) {
	const {
		onMessage,
		onNewMessage,
		onConversationStatusChange,
		onTypingIndicator,
		onVisitorPresence,
		shouldReconnect = true,
	} = options;

	const subscriptionsRef = useRef<Set<string>>(new Set());

	const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
		useWebSocket<ServerMessage>(getWebSocketUrl(), {
			shouldReconnect: () => shouldReconnect,
		});

	// Handle incoming messages
	useEffect(() => {
		if (!lastJsonMessage) {
			return;
		}

		const parsed = serverMessageSchema.safeParse(lastJsonMessage);
		if (!parsed.success) {
			console.error("Invalid WebSocket message:", lastJsonMessage);
			return;
		}

		const message = parsed.data;

		// Call general message handler
		onMessage?.(message);

		// Call specific handlers based on message type
		switch (message.type) {
			case "new_message": {
				onNewMessage?.(message);
				break;
			}
			case "conversation_status_changed": {
				onConversationStatusChange?.(message);
				break;
			}
			case "typing_indicator": {
				onTypingIndicator?.(message);
				break;
			}
			case "visitor_online":
			case "visitor_offline": {
				onVisitorPresence?.(message);
				break;
			}
			case "subscription_confirmed": {
				console.log(`Subscribed to channel: ${message.channel}`);
				break;
			}
			case "subscription_error": {
				console.error(`Subscription error: ${message.error}`, message.channel);
				break;
			}
			case "pong": {
				console.log("Received pong from server");
				break;
			}

			default: {
				console.log("Unhandled message type:", message.type);
				break;
			}
		}
	}, [
		lastJsonMessage,
		onMessage,
		onNewMessage,
		onConversationStatusChange,
		onTypingIndicator,
		onVisitorPresence,
	]);

	// Send message helper
	const sendMessage = useCallback(
		(message: ClientMessage) => {
			if (readyState === ReadyState.OPEN) {
				sendJsonMessage(message);
			} else {
				console.warn("WebSocket is not open. Message not sent:", message);
			}
		},
		[readyState, sendJsonMessage]
	);

	// Subscribe to conversation (for visitors and team members)
	const subscribeToConversation = useCallback(
		(conversationId: string) => {
			const channel = `conversation:${conversationId}`;
			if (!subscriptionsRef.current.has(channel)) {
				subscriptionsRef.current.add(channel);
				sendMessage({
					type: "subscribe_conversation",
					conversationId,
				});
			}
		},
		[sendMessage]
	);

	// Subscribe to website (team members only)
	const subscribeToWebsite = useCallback(
		(websiteId: string) => {
			const channel = `website:${websiteId}`;
			if (!subscriptionsRef.current.has(channel)) {
				subscriptionsRef.current.add(channel);
				sendMessage({
					type: "subscribe_website",
					websiteId,
				});
			}
		},
		[sendMessage]
	);

	// Unsubscribe from conversation
	const unsubscribeFromConversation = useCallback(
		(conversationId: string) => {
			const channel = `conversation:${conversationId}`;
			if (subscriptionsRef.current.has(channel)) {
				subscriptionsRef.current.delete(channel);
				sendMessage({
					type: "unsubscribe_conversation",
					conversationId,
				});
			}
		},
		[sendMessage]
	);

	// Unsubscribe from website
	const unsubscribeFromWebsite = useCallback(
		(websiteId: string) => {
			const channel = `website:${websiteId}`;
			if (subscriptionsRef.current.has(channel)) {
				subscriptionsRef.current.delete(channel);
				sendMessage({
					type: "unsubscribe_website",
					websiteId,
				});
			}
		},
		[sendMessage]
	);

	// Typing indicators
	const startTyping = useCallback(
		(conversationId: string) => {
			sendMessage({
				type: "typing_start",
				conversationId,
			});
		},
		[sendMessage]
	);

	const stopTyping = useCallback(
		(conversationId: string) => {
			sendMessage({
				type: "typing_stop",
				conversationId,
			});
		},
		[sendMessage]
	);

	// Ping server
	const ping = useCallback(() => {
		sendMessage({ type: "ping" });
	}, [sendMessage]);

	// Clean up subscriptions on unmount
	useEffect(() => {
		return () => {
			subscriptionsRef.current.clear();
		};
	}, []);

	return {
		// Connection state
		readyState,
		isConnected: readyState === ReadyState.OPEN,
		isConnecting: readyState === ReadyState.CONNECTING,

		// Low-level access
		sendMessage,
		getWebSocket,

		// Subscription management
		subscribeToConversation,
		subscribeToWebsite,
		unsubscribeFromConversation,
		unsubscribeFromWebsite,

		// Interaction helpers
		startTyping,
		stopTyping,
		ping,

		// Current subscriptions
		subscriptions: Array.from(subscriptionsRef.current),
	};
}

// Legacy hook for backward compatibility
export function usePingWebSocket() {
	const { ping, readyState, isConnected } = useAdvancedWebSocket();

	useEffect(() => {
		if (isConnected) {
			ping();
		}
	}, [isConnected, ping]);

	return { readyState };
}
