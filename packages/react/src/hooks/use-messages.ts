import type { CossistantClient } from "@cossistant/core";
import type { Message } from "@cossistant/types/schemas";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PENDING_CONVERSATION_ID } from "../utils/id";

interface UseMessagesParams {
	client: CossistantClient | null;
	conversationId: string | null;
	defaultMessages?: Message[];
}

export function useMessages({
	client,
	conversationId,
	defaultMessages = [],
}: UseMessagesParams) {
	const queryClient = useQueryClient();

	const hasRealConversation =
		Boolean(conversationId) && conversationId !== PENDING_CONVERSATION_ID;

	return useQuery({
		queryKey: ["messages", conversationId],
		queryFn: async () => {
			if (!(client && conversationId)) {
				throw new Error("Client and conversation ID required");
			}

			// For pending conversations, return default messages
			if (!hasRealConversation) {
				return defaultMessages;
			}

			// For real conversations, return cached data or fetch from server
			// In the future, this would call: client.rest.getMessages(conversationId)
			const cached = queryClient.getQueryData<Message[]>([
				"messages",
				conversationId,
			]);
			return cached || [];
		},
		enabled: Boolean(client && conversationId),
		staleTime: 1 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		placeholderData: defaultMessages,
	});
}

// Helper to add a message optimistically
export function useAddMessage(client: CossistantClient | null) {
	const queryClient = useQueryClient();

	return (conversationId: string, message: Message) => {
		queryClient.setQueryData<Message[]>(["messages", conversationId], (old) => [
			...(old || []),
			message,
		]);
	};
}
