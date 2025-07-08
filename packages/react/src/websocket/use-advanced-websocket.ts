/**
 * Advanced WebSocket React Hook
 *
 * Provides a type-safe, reliable WebSocket connection with:
 * - Automatic reconnection with exponential backoff
 * - Message queuing for offline support
 * - Heartbeat mechanism to detect stale connections
 * - Typed message handling
 * - Subscription management
 * - Connection statistics
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type {
	ClientMessages,
	MessageContent,
	QueuedMessage,
	ServerMessages,
	SubscriptionState,
	UseAdvancedWebSocketReturn,
	WebSocketConfig,
	WebSocketEventHandlers,
} from "./types";
import { WebSocketState } from "./types";

const DEFAULT_CONFIG: Required<WebSocketConfig> = {
	url: "",
	autoReconnect: true,
	reconnectDelay: 1000,
	maxReconnectDelay: 30_000,
	reconnectDelayMultiplier: 1.5,
	maxReconnectAttempts: Number.POSITIVE_INFINITY,
	enableMessageQueue: true,
	maxQueueSize: 100,
	heartbeatInterval: 30_000,
	requestTimeout: 10_000,
	debug: false,
	headers: {},
	protocols: [],
	typingProgressThrottle: 100,
};

/**
 * Advanced WebSocket hook for real-time communication
 */
export function useAdvancedWebSocket(
	config: WebSocketConfig = {},
	handlers: WebSocketEventHandlers = {}
): UseAdvancedWebSocketReturn {
	// Merge config with defaults
	const finalConfig = { ...DEFAULT_CONFIG, ...config };

	// WebSocket instance
	const wsRef = useRef<WebSocket | null>(null);

	// Connection state
	const [readyState, setReadyState] = useState<WebSocketState>(
		WebSocketState.CLOSED
	);

	// Subscriptions
	const subscriptionsRef = useRef<SubscriptionState>({
		conversations: new Set(),
		websites: new Set(),
	});

	// Message queue for offline support
	const messageQueueRef = useRef<QueuedMessage[]>([]);

	// Reconnection state
	const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
	const reconnectAttemptsRef = useRef(0);
	const reconnectDelayRef = useRef(finalConfig.reconnectDelay);

	// Heartbeat state
	const heartbeatIntervalRef = useRef<NodeJS.Timeout>();
	const lastPongRef = useRef<number>(Date.now());

	// Typing progress throttle
	const typingProgressTimeoutRef = useRef<NodeJS.Timeout>();
	const lastTypingProgressRef = useRef<{ [conversationId: string]: string }>(
		{}
	);

	// Connection statistics
	const statsRef = useRef({
		connectTime: undefined as number | undefined,
		messagesSent: 0,
		messagesReceived: 0,
		reconnectAttempts: 0,
		lastError: undefined as string | undefined,
		lastErrorTime: undefined as number | undefined,
	});

	// Debug logging
	const log = useCallback(
		(...args: unknown[]) => {
			if (finalConfig.debug) {
				console.log("[WebSocket]", ...args);
			}
		},
		[finalConfig.debug]
	);

	/**
	 * Process incoming messages
	 */
	const handleMessage = useCallback(
		(event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data) as ServerMessages;
				statsRef.current.messagesReceived++;

				log("Received message:", message.type, message);

				// Update last pong time for heartbeat
				if (message.type === "pong") {
					lastPongRef.current = Date.now();
				}

				// Call general handler
				handlers.onMessage?.(message);

				// Call specific handlers
				switch (message.type) {
					case "new_message":
						handlers.onNewMessage?.(message);
						break;
					case "conversation_status_changed":
						handlers.onConversationStatusChange?.(message);
						break;
					case "conversation_assigned":
						handlers.onConversationAssigned?.(message);
						break;
					case "typing_indicator":
						handlers.onTypingIndicator?.(message);
						break;
					case "typing_progress":
						handlers.onTypingProgress?.(message);
						break;
					case "visitor_online":
					case "visitor_offline":
						handlers.onVisitorPresence?.(message);
						break;
					case "subscription_confirmed":
						log(`Subscribed to channel: ${message.channel}`);
						break;
					case "subscription_error":
						console.error(
							`Subscription error: ${message.error}`,
							message.channel
						);
						break;
					case "connection_established":
						log(`Connection established: ${message.connectionId}`);
						// Resubscribe to all channels
						resubscribeToAllChannels();
						break;
					case "error":
						console.error(
							`WebSocket error: ${message.error}`,
							message.code,
							message.details
						);
						statsRef.current.lastError = message.error;
						statsRef.current.lastErrorTime = Date.now();
						break;
					case "reconnect":
						log(`Server requested reconnect: ${message.reason}`);
						if (message.retryAfter) {
							reconnectDelayRef.current = message.retryAfter;
						}
						disconnect();
						connect();
						break;
				}
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error, event.data);
			}
		},
		[handlers, log]
	);

	/**
	 * Send a message to the server
	 */
	const sendMessage = useCallback(
		(message: ClientMessages) => {
			// Add timestamp and ID if not present
			const finalMessage = {
				...message,
				timestamp: message.timestamp || Date.now(),
				id:
					message.id ||
					`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			};

			if (wsRef.current?.readyState === WebSocket.OPEN) {
				try {
					wsRef.current.send(JSON.stringify(finalMessage));
					statsRef.current.messagesSent++;
					log("Sent message:", finalMessage.type, finalMessage);
				} catch (error) {
					console.error("Failed to send message:", error);

					// Queue message if enabled
					if (
						finalConfig.enableMessageQueue &&
						messageQueueRef.current.length < finalConfig.maxQueueSize
					) {
						messageQueueRef.current.push({
							message: finalMessage,
							timestamp: Date.now(),
							attempts: 0,
						});
						log("Message queued:", finalMessage.type);
					}
				}
			} else {
				// Queue message if enabled and not connected
				if (
					finalConfig.enableMessageQueue &&
					messageQueueRef.current.length < finalConfig.maxQueueSize
				) {
					messageQueueRef.current.push({
						message: finalMessage,
						timestamp: Date.now(),
						attempts: 0,
					});
					log("Message queued (not connected):", finalMessage.type);
				} else {
					console.warn("WebSocket not connected and queue is full or disabled");
				}
			}
		},
		[finalConfig.enableMessageQueue, finalConfig.maxQueueSize, log]
	);

	/**
	 * Process queued messages
	 */
	const processMessageQueue = useCallback(() => {
		if (
			wsRef.current?.readyState !== WebSocket.OPEN ||
			messageQueueRef.current.length === 0
		) {
			return;
		}

		const queue = [...messageQueueRef.current];
		messageQueueRef.current = [];

		for (const item of queue) {
			if (item.attempts < 3) {
				try {
					wsRef.current.send(JSON.stringify(item.message));
					statsRef.current.messagesSent++;
					log("Sent queued message:", item.message.type);
				} catch (error) {
					console.error("Failed to send queued message:", error);
					item.attempts++;
					messageQueueRef.current.push(item);
				}
			} else {
				log("Dropped message after 3 attempts:", item.message.type);
			}
		}
	}, [log]);

	/**
	 * Resubscribe to all channels after reconnection
	 */
	const resubscribeToAllChannels = useCallback(() => {
		// Resubscribe to conversations
		for (const conversationId of subscriptionsRef.current.conversations) {
			sendMessage({
				type: "subscribe_conversation",
				conversationId,
			});
		}

		// Resubscribe to websites
		for (const websiteId of subscriptionsRef.current.websites) {
			sendMessage({
				type: "subscribe_website",
				websiteId,
			});
		}

		log("Resubscribed to all channels");
	}, [sendMessage, log]);

	/**
	 * Start heartbeat mechanism
	 */
	const startHeartbeat = useCallback(() => {
		if (heartbeatIntervalRef.current) {
			clearInterval(heartbeatIntervalRef.current);
		}

		heartbeatIntervalRef.current = setInterval(() => {
			if (wsRef.current?.readyState === WebSocket.OPEN) {
				// Check if we've received a pong recently
				const timeSinceLastPong = Date.now() - lastPongRef.current;
				if (timeSinceLastPong > finalConfig.heartbeatInterval * 2) {
					log("Connection appears stale, reconnecting...");
					disconnect();
					connect();
					return;
				}

				// Send ping
				sendMessage({ type: "ping" });
			}
		}, finalConfig.heartbeatInterval);

		log("Heartbeat started");
	}, [finalConfig.heartbeatInterval, sendMessage, log]);

	/**
	 * Stop heartbeat mechanism
	 */
	const stopHeartbeat = useCallback(() => {
		if (heartbeatIntervalRef.current) {
			clearInterval(heartbeatIntervalRef.current);
			heartbeatIntervalRef.current = undefined;
			log("Heartbeat stopped");
		}
	}, [log]);

	/**
	 * Connect to WebSocket
	 */
	const connect = useCallback(() => {
		if (
			wsRef.current?.readyState === WebSocket.OPEN ||
			wsRef.current?.readyState === WebSocket.CONNECTING
		) {
			log("Already connected or connecting");
			return;
		}

		try {
			const url =
				finalConfig.url ||
				`${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`;

			wsRef.current = new WebSocket(url, finalConfig.protocols);
			setReadyState(WebSocketState.CONNECTING);

			// Add event listeners
			wsRef.current.onopen = (event) => {
				log("Connected");
				setReadyState(WebSocketState.OPEN);
				statsRef.current.connectTime = Date.now();
				reconnectAttemptsRef.current = 0;
				reconnectDelayRef.current = finalConfig.reconnectDelay;

				// Start heartbeat
				startHeartbeat();

				// Process queued messages
				processMessageQueue();

				// Call handler
				handlers.onOpen?.(event);

				// Notify reconnection success if this was a reconnection
				if (statsRef.current.reconnectAttempts > 0) {
					handlers.onReconnectSuccess?.();
				}
			};

			wsRef.current.onclose = (event) => {
				log("Disconnected", event.code, event.reason);
				setReadyState(WebSocketState.CLOSED);
				statsRef.current.connectTime = undefined;

				// Stop heartbeat
				stopHeartbeat();

				// Call handler
				handlers.onClose?.(event);

				// Attempt reconnection if enabled
				if (
					finalConfig.autoReconnect &&
					reconnectAttemptsRef.current < finalConfig.maxReconnectAttempts
				) {
					reconnectAttemptsRef.current++;
					statsRef.current.reconnectAttempts++;

					handlers.onReconnectAttempt?.(reconnectAttemptsRef.current);

					log(
						`Reconnecting in ${reconnectDelayRef.current}ms (attempt ${reconnectAttemptsRef.current})`
					);

					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, reconnectDelayRef.current);

					// Increase delay for next attempt
					reconnectDelayRef.current = Math.min(
						reconnectDelayRef.current * finalConfig.reconnectDelayMultiplier,
						finalConfig.maxReconnectDelay
					);
				} else if (
					reconnectAttemptsRef.current >= finalConfig.maxReconnectAttempts
				) {
					handlers.onReconnectFail?.();
				}
			};

			wsRef.current.onerror = (event) => {
				console.error("WebSocket error:", event);
				statsRef.current.lastError = "Connection error";
				statsRef.current.lastErrorTime = Date.now();
				handlers.onError?.(event);
			};

			wsRef.current.onmessage = handleMessage;
		} catch (error) {
			console.error("Failed to create WebSocket:", error);
			setReadyState(WebSocketState.CLOSED);
		}
	}, [
		finalConfig,
		startHeartbeat,
		stopHeartbeat,
		processMessageQueue,
		handleMessage,
		handlers,
		log,
	]);

	/**
	 * Disconnect from WebSocket
	 */
	const disconnect = useCallback(() => {
		// Clear reconnection timeout
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = undefined;
		}

		// Stop heartbeat
		stopHeartbeat();

		// Close WebSocket
		if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
		}

		setReadyState(WebSocketState.CLOSED);
		log("Disconnected manually");
	}, [stopHeartbeat, log]);

	/**
	 * Subscribe to a conversation
	 */
	const subscribeToConversation = useCallback(
		(conversationId: string) => {
			if (!subscriptionsRef.current.conversations.has(conversationId)) {
				subscriptionsRef.current.conversations.add(conversationId);
				sendMessage({
					type: "subscribe_conversation",
					conversationId,
				});
				log("Subscribed to conversation:", conversationId);
			}
		},
		[sendMessage, log]
	);

	/**
	 * Subscribe to a website
	 */
	const subscribeToWebsite = useCallback(
		(websiteId: string) => {
			if (!subscriptionsRef.current.websites.has(websiteId)) {
				subscriptionsRef.current.websites.add(websiteId);
				sendMessage({
					type: "subscribe_website",
					websiteId,
				});
				log("Subscribed to website:", websiteId);
			}
		},
		[sendMessage, log]
	);

	/**
	 * Unsubscribe from a conversation
	 */
	const unsubscribeFromConversation = useCallback(
		(conversationId: string) => {
			if (subscriptionsRef.current.conversations.has(conversationId)) {
				subscriptionsRef.current.conversations.delete(conversationId);
				sendMessage({
					type: "unsubscribe_conversation",
					conversationId,
				});
				log("Unsubscribed from conversation:", conversationId);
			}
		},
		[sendMessage, log]
	);

	/**
	 * Unsubscribe from a website
	 */
	const unsubscribeFromWebsite = useCallback(
		(websiteId: string) => {
			if (subscriptionsRef.current.websites.has(websiteId)) {
				subscriptionsRef.current.websites.delete(websiteId);
				sendMessage({
					type: "unsubscribe_website",
					websiteId,
				});
				log("Unsubscribed from website:", websiteId);
			}
		},
		[sendMessage, log]
	);

	/**
	 * Send typing start indicator
	 */
	const startTyping = useCallback(
		(conversationId: string) => {
			sendMessage({
				type: "typing_start",
				conversationId,
			});
			log("Started typing in conversation:", conversationId);
		},
		[sendMessage, log]
	);

	/**
	 * Send typing stop indicator
	 */
	const stopTyping = useCallback(
		(conversationId: string) => {
			sendMessage({
				type: "typing_stop",
				conversationId,
			});

			// Clear any pending typing progress
			if (typingProgressTimeoutRef.current) {
				clearTimeout(typingProgressTimeoutRef.current);
				typingProgressTimeoutRef.current = undefined;
			}
			delete lastTypingProgressRef.current[conversationId];

			log("Stopped typing in conversation:", conversationId);
		},
		[sendMessage, log]
	);

	/**
	 * Send typing progress (throttled)
	 */
	const sendTypingProgress = useCallback(
		(conversationId: string, content: string) => {
			// Check if content has changed
			if (lastTypingProgressRef.current[conversationId] === content) {
				return;
			}

			lastTypingProgressRef.current[conversationId] = content;

			// Clear existing timeout
			if (typingProgressTimeoutRef.current) {
				clearTimeout(typingProgressTimeoutRef.current);
			}

			// Throttle updates
			typingProgressTimeoutRef.current = setTimeout(() => {
				sendMessage({
					type: "typing_progress",
					conversationId,
					content,
				});
				log("Sent typing progress:", conversationId, content.length);
			}, finalConfig.typingProgressThrottle);
		},
		[sendMessage, finalConfig.typingProgressThrottle, log]
	);

	/**
	 * Send a chat message
	 */
	const sendChatMessage = useCallback(
		(
			conversationId: string,
			content: MessageContent,
			metadata?: Record<string, unknown>
		) => {
			sendMessage({
				type: "send_message",
				conversationId,
				content,
				metadata,
			});

			// Stop typing when message is sent
			stopTyping(conversationId);

			log("Sent chat message:", conversationId);
		},
		[sendMessage, stopTyping, log]
	);

	/**
	 * Send a ping
	 */
	const ping = useCallback(() => {
		sendMessage({ type: "ping" });
		log("Sent ping");
	}, [sendMessage, log]);

	/**
	 * Get WebSocket instance
	 */
	const getWebSocket = useCallback(() => wsRef.current, []);

	/**
	 * Get current subscriptions
	 */
	const getSubscriptions = useCallback(() => {
		const conversations = Array.from(subscriptionsRef.current.conversations);
		const websites = Array.from(subscriptionsRef.current.websites);
		return [
			...conversations.map((id) => `conversation:${id}`),
			...websites.map((id) => `website:${id}`),
		];
	}, []);

	// Auto-connect on mount if URL is provided
	useEffect(() => {
		if (finalConfig.url) {
			connect();
		}

		return () => {
			disconnect();
		};
	}, [finalConfig.url]);

	// Return hook interface
	return {
		readyState,
		isConnected: readyState === WebSocketState.OPEN,
		isConnecting: readyState === WebSocketState.CONNECTING,
		sendMessage,
		subscribeToConversation,
		subscribeToWebsite,
		unsubscribeFromConversation,
		unsubscribeFromWebsite,
		startTyping,
		stopTyping,
		sendTypingProgress,
		sendChatMessage,
		connect,
		disconnect,
		ping,
		getWebSocket,
		subscriptions: getSubscriptions(),
		queuedMessageCount: messageQueueRef.current.length,
		stats: { ...statsRef.current },
	};
}
