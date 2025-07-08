/**
 * WebSocket Usage Examples
 *
 * This file contains examples of how to use the WebSocket functionality
 * in different scenarios.
 */

import { useEffect, useState } from "react";
import {
	useWebSocket,
	useWebSocketDirect,
	WebSocketProvider,
} from "./provider";
import type { NewMessageMessage, TypingProgressServerMessage } from "./types";

/**
 * Example 1: Basic WebSocket usage with provider
 */
export function ChatApp() {
	return (
		<WebSocketProvider
			config={{
				url: "wss://api.example.com/ws",
				autoReconnect: true,
				debug: process.env.NODE_ENV === "development",
			}}
			handlers={{
				onNewMessage: (message) => {
					console.log("New message received:", message);
				},
				onTypingProgress: (message) => {
					console.log("Someone is typing:", message.content);
				},
			}}
		>
			<ChatComponent />
		</WebSocketProvider>
	);
}

/**
 * Example 2: Chat component using WebSocket context
 */
function ChatComponent() {
	const {
		isConnected,
		subscribeToConversation,
		sendChatMessage,
		sendTypingProgress,
		startTyping,
		stopTyping,
	} = useWebSocket();

	const [conversationId] = useState("conversation-123");
	const [message, setMessage] = useState("");
	const [typingUsers, setTypingUsers] = useState<string[]>([]);

	// Subscribe to conversation on mount
	useEffect(() => {
		if (isConnected) {
			subscribeToConversation(conversationId);
		}
	}, [isConnected, conversationId, subscribeToConversation]);

	// Handle message input
	const handleMessageChange = (value: string) => {
		setMessage(value);

		// Send typing progress for real-time preview
		if (value.trim()) {
			sendTypingProgress(conversationId, value);
		}
	};

	// Handle message send
	const handleSend = () => {
		if (message.trim()) {
			sendChatMessage(conversationId, {
				text: message,
				metadata: { timestamp: Date.now() },
			});
			setMessage("");
		}
	};

	// Handle typing start/stop
	const handleTypingStart = () => {
		startTyping(conversationId);
	};

	const handleTypingStop = () => {
		stopTyping(conversationId);
	};

	return (
		<div className="chat-container">
			<div className="connection-status">
				{isConnected ? "Connected" : "Disconnected"}
			</div>

			<div className="messages">{/* Message list would go here */}</div>

			{typingUsers.length > 0 && (
				<div className="typing-indicator">
					{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
					typing...
				</div>
			)}

			<div className="message-input">
				<input
					onBlur={handleTypingStop}
					onChange={(e) => handleMessageChange(e.target.value)}
					onFocus={handleTypingStart}
					placeholder="Type a message..."
					type="text"
					value={message}
				/>
				<button disabled={!message.trim()} onClick={handleSend}>
					Send
				</button>
			</div>
		</div>
	);
}

/**
 * Example 3: Dashboard component for support agents
 */
export function SupportDashboard() {
	const [conversations, setConversations] = useState<string[]>([]);
	const [typingPreviews, setTypingPreviews] = useState<Record<string, string>>(
		{}
	);

	const websocket = useWebSocketDirect({
		config: {
			url: "wss://api.example.com/ws",
			autoReconnect: true,
			debug: true,
		},
		handlers: {
			onNewMessage: (message: NewMessageMessage) => {
				// Handle new messages from visitors
				console.log("New message from visitor:", message);
			},
			onTypingProgress: (message: TypingProgressServerMessage) => {
				// Show real-time typing preview
				if (message.userType === "visitor") {
					setTypingPreviews((prev) => ({
						...prev,
						[message.conversationId]: message.content,
					}));
				}
			},
			onTypingIndicator: (message) => {
				// Clear typing preview when user stops typing
				if (!message.isTyping) {
					setTypingPreviews((prev) => {
						const updated = { ...prev };
						delete updated[message.conversationId];
						return updated;
					});
				}
			},
		},
	});

	// Subscribe to website for all conversations
	useEffect(() => {
		if (websocket.isConnected) {
			websocket.subscribeToWebsite("website-123");
		}
	}, [websocket.isConnected]);

	return (
		<div className="dashboard">
			<h1>Support Dashboard</h1>

			<div className="connection-status">
				Status: {websocket.isConnected ? "Connected" : "Disconnected"}
			</div>

			<div className="conversations">
				{conversations.map((conversationId) => (
					<div className="conversation-item" key={conversationId}>
						<h3>Conversation {conversationId}</h3>

						{/* Show typing preview if visitor is typing */}
						{typingPreviews[conversationId] && (
							<div className="typing-preview">
								<em>Visitor is typing: "{typingPreviews[conversationId]}"</em>
							</div>
						)}

						<button
							onClick={() =>
								websocket.sendChatMessage(conversationId, {
									text: "Hello! How can I help you today?",
								})
							}
						>
							Send Response
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Example 4: Widget component for visitors
 */
export function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [conversationId] = useState("visitor-conversation-456");

	const websocket = useWebSocketDirect({
		config: {
			url: "wss://api.example.com/ws",
			autoReconnect: true,
			heartbeatInterval: 30_000,
		},
		handlers: {
			onNewMessage: (message) => {
				// Handle responses from support agents
				if (
					message.senderType === "user" ||
					message.senderType === "ai_agent"
				) {
					console.log("Response from support:", message);
				}
			},
			onTypingIndicator: (message) => {
				// Show when support agent is typing
				console.log("Support agent typing:", message.isTyping);
			},
		},
	});

	// Subscribe to conversation when widget opens
	useEffect(() => {
		if (isOpen && websocket.isConnected) {
			websocket.subscribeToConversation(conversationId);
		}
	}, [isOpen, websocket.isConnected, conversationId]);

	return (
		<div className="chat-widget">
			{isOpen ? (
				<div className="widget-container">
					<div className="widget-header">
						<h3>Chat Support</h3>
						<button onClick={() => setIsOpen(false)}>×</button>
					</div>

					<div className="widget-content">
						<ChatComponent />
					</div>
				</div>
			) : (
				<button className="widget-trigger" onClick={() => setIsOpen(true)}>
					💬 Chat
				</button>
			)}
		</div>
	);
}

/**
 * Example 5: Hook for monitoring connection health
 */
export function useWebSocketHealth() {
	const websocket = useWebSocket();
	const [healthStatus, setHealthStatus] = useState<
		"healthy" | "degraded" | "unhealthy"
	>("healthy");

	useEffect(() => {
		const { stats, isConnected } = websocket;

		if (!isConnected) {
			setHealthStatus("unhealthy");
		} else if (stats.reconnectAttempts > 5) {
			setHealthStatus("degraded");
		} else {
			setHealthStatus("healthy");
		}
	}, [websocket.isConnected, websocket.stats.reconnectAttempts]);

	return {
		healthStatus,
		stats: websocket.stats,
		isConnected: websocket.isConnected,
	};
}
