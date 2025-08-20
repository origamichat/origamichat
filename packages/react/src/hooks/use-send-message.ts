import type { CossistantClient, CossistantRestClient } from "@cossistant/core";
import { generateConversationId, generateMessageId } from "@cossistant/core";
import type { CreateConversationResponseBody } from "@cossistant/types/api/conversation";
import type { Conversation, Message } from "@cossistant/types/schemas";
import { MessageType, MessageVisibility, SenderType } from "@cossistant/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DefaultMessage } from "../provider";
import { defaultMessagesToCreateMessages, defaultMessagesToMessages } from "../utils/message-converter";

export interface SendMessageOptions {
	conversationId?: string | null;
	message: string;
	files?: File[];
	defaultMessages?: DefaultMessage[];
	visitorId?: string;
	onSuccess?: (conversationId: string, messageId: string) => void;
	onError?: (error: Error) => void;
}

interface SendMessageResult {
	conversationId: string;
	messageId: string;
	conversation?: CreateConversationResponseBody["conversation"];
}

/**
 * Hook for sending messages with lazy conversation creation.
 * Creates a conversation only when the first message is sent.
 */
export function useSendMessage(
	client: CossistantClient | CossistantRestClient | null
) {
	const queryClient = useQueryClient();

	return useMutation<SendMessageResult, Error, SendMessageOptions>({
		mutationFn: async ({
			conversationId,
			message,
			files = [],
			defaultMessages = [],
			visitorId,
		}) => {
			if (!client) {
				throw new Error("No client available");
			}

			// If no conversation exists, create one with the initial messages
			if (!conversationId) {
				const newConversationId = generateConversationId();
				
				// Combine default messages with the user's message
				const allDefaultMessages: DefaultMessage[] = [
					...defaultMessages,
					{
						content: message,
						senderType: SenderType.VISITOR,
						senderId: visitorId,
					},
				];

				// Create conversation with all initial messages
				const createMessages = defaultMessagesToCreateMessages(
					allDefaultMessages,
					newConversationId,
					visitorId
				);

				const response = await client.createConversation({
					conversationId: newConversationId,
					defaultMessages: createMessages,
				});

				return {
					conversationId: response.conversation.id,
					messageId: createMessages[createMessages.length - 1].id || generateMessageId(),
					conversation: response.conversation,
				};
			}

			// If conversation exists, send the message via WebSocket or REST
			// For now, we'll return a placeholder since the actual message sending
			// logic will need to be implemented based on your WebSocket/REST setup
			const messageId = generateMessageId();
			
			// TODO: Implement actual message sending via WebSocket or REST API
			// This would typically involve:
			// 1. Sending via WebSocket if connected
			// 2. Falling back to REST API if WebSocket is not available
			// 3. Handling file uploads if files are present
			
			return {
				conversationId,
				messageId,
			};
		},
		onMutate: async ({ conversationId, message, defaultMessages = [], visitorId }) => {
			// Generate IDs for optimistic updates
			const optimisticConversationId = conversationId || generateConversationId();
			const optimisticMessageId = generateMessageId();
			const now = new Date();

			// If creating a new conversation, add it optimistically
			if (!conversationId) {
				// Add optimistic conversation
				const optimisticConversation: Conversation = {
					id: optimisticConversationId,
					title: undefined,
					createdAt: now,
					updatedAt: now,
					visitorId: visitorId || "",
					websiteId: "",
					status: "open",
				};

				queryClient.setQueryData<Conversation>(
					["conversation", optimisticConversationId],
					optimisticConversation
				);

				// Add to conversations list
				queryClient.setQueryData<Conversation[]>(["conversations"], (old) => [
					...(old || []),
					optimisticConversation,
				]);

				// Add all messages (default + user message) optimistically
				const allMessages: Message[] = [
					...defaultMessagesToMessages(defaultMessages, optimisticConversationId, visitorId),
					{
						id: optimisticMessageId,
						bodyMd: message,
						type: MessageType.TEXT,
						userId: null,
						aiAgentId: null,
						visitorId: visitorId || null,
						conversationId: optimisticConversationId,
						createdAt: now,
						updatedAt: now,
						deletedAt: null,
						visibility: MessageVisibility.PUBLIC,
					},
				];

				queryClient.setQueryData<Message[]>(
					["messages", optimisticConversationId],
					allMessages
				);
			} else {
				// Just add the new message to existing conversation
				const newMessage: Message = {
					id: optimisticMessageId,
					bodyMd: message,
					type: MessageType.TEXT,
					userId: null,
					aiAgentId: null,
					visitorId: visitorId || null,
					conversationId,
					createdAt: now,
					updatedAt: now,
					deletedAt: null,
					visibility: MessageVisibility.PUBLIC,
				};

				queryClient.setQueryData<Message[]>(
					["messages", conversationId],
					(old) => [...(old || []), newMessage]
				);
			}

			return { 
				optimisticConversationId, 
				optimisticMessageId,
				wasNewConversation: !conversationId 
			};
		},
		onSuccess: (data, variables, context) => {
			// Update with real IDs from server
			if (context?.wasNewConversation && data.conversation) {
				// Update conversation with server data
				queryClient.setQueryData<Conversation>(
					["conversation", data.conversationId],
					data.conversation
				);

				// Update conversations list
				queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
					if (!old) return [data.conversation!];
					
					// Replace optimistic conversation with real one
					const index = old.findIndex(
						(c) => c.id === context.optimisticConversationId
					);
					if (index >= 0) {
						const updated = [...old];
						updated[index] = data.conversation!;
						return updated;
					}
					return [...old, data.conversation!];
				});
			}

			// Invalidate messages to ensure they're in sync
			queryClient.invalidateQueries({
				queryKey: ["messages", data.conversationId],
			});

			variables.onSuccess?.(data.conversationId, data.messageId);
		},
		onError: (error, variables, context) => {
			// Rollback optimistic updates
			if (context?.optimisticConversationId) {
				if (context.wasNewConversation) {
					// Remove optimistic conversation
					queryClient.removeQueries({
						queryKey: ["conversation", context.optimisticConversationId],
					});
					
					// Remove from conversations list
					queryClient.setQueryData<Conversation[]>(
						["conversations"],
						(old) => old?.filter((c) => c.id !== context.optimisticConversationId) || []
					);
					
					// Remove optimistic messages
					queryClient.removeQueries({
						queryKey: ["messages", context.optimisticConversationId],
					});
				} else {
					// Remove just the optimistic message
					queryClient.setQueryData<Message[]>(
						["messages", variables.conversationId!],
						(old) => old?.filter((m) => m.id !== context.optimisticMessageId) || []
					);
				}
			}

			variables.onError?.(error);
		},
	});
}