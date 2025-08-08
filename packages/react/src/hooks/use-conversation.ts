"use client";

import type { Message } from "@cossistant/types";
import { ConversationStatus, SenderType } from "@cossistant/types";
import { useCallback } from "react";
import {
	useActiveMessages,
	useActiveTypingIndicator,
	useAllConversations,
	useConversationActions,
	useConversationState,
} from "../store";
import { useWebSocket } from "../support/context/websocket";

/**
 * High-level hook that combines WebSocket and store functionality
 * for managing conversations. This hook provides a simple interface
 * for sending messages and accessing conversation state.
 */
export function useConversation() {
	const { isConnected, isConnecting, send } = useWebSocket();

	const messages = useActiveMessages();
	const typingIndicator = useActiveTypingIndicator();
	const { activeConversationId } = useConversationState();
	const conversations = useAllConversations();

	// Actions from the new context
	const {
		addMessage,
		setTypingIndicator,
		setActiveConversation,
		addConversation,
	} = useConversationActions();

	const sendMessage = useCallback(
		async (content: string, files?: File[]) => {
			// Ensure we have an active conversation
			const conversationId = activeConversationId || `conv-${Date.now()}`;

			if (!activeConversationId) {
				// Create conversation if it doesn't exist
				addConversation({
					id: conversationId,
					createdAt: new Date(),
					updatedAt: new Date(),
					userId: "user-1",
					status: ConversationStatus.OPEN,
					unreadCount: 0,
				});
				setActiveConversation(conversationId);
			}

			// Add user message to store
			const userMessage: Message = {
				id: `msg-${Date.now()}`,
				content,
				timestamp: new Date(),
				sender: SenderType.VISITOR,
				conversationId,
			};
			addMessage(conversationId, userMessage);

			// Send presence update via WebSocket if connected
			if (isConnected) {
				send({
					type: "USER_PRESENCE_UPDATE",
					data: {
						userId: "user-1",
						status: "online",
						lastSeen: Date.now(),
					},
					timestamp: Date.now(),
				});
			}

			// Set typing indicator for AI (local UI state)
			setTypingIndicator(conversationId, {
				conversationId,
				type: SenderType.AI,
				timestamp: new Date(),
			});

			return userMessage;
		},
		[
			activeConversationId,
			isConnected,
			send,
			addMessage,
			setTypingIndicator,
			setActiveConversation,
			addConversation,
		]
	);

	const clearTyping = useCallback(() => {
		if (activeConversationId) {
			setTypingIndicator(activeConversationId, null);
		}
	}, [activeConversationId, setTypingIndicator]);

	return {
		// State
		messages,
		typingIndicator,
		activeConversationId,
		conversations,
		isConnected,
		isConnecting,

		// Actions
		sendMessage,
		clearTyping,
		setActiveConversation,
	};
}
