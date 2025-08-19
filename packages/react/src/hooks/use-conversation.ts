import type { CossistantClient } from "@cossistant/core";
import type { GetConversationResponse } from "@cossistant/types/api/conversation";
import { useQuery } from "@tanstack/react-query";

export interface UseConversationResult {
	conversation: GetConversationResponse["conversation"] | null;
	isLoading: boolean;
	error: Error | null;
}

export function useConversation(
	client: CossistantClient | null,
	conversationId: string | null
): UseConversationResult {
	const { data, isLoading, error } = useQuery({
		queryKey: ["conversation", client?.getConfiguration().publicKey, conversationId],
		queryFn: async () => {
			if (!client || !conversationId) {
				throw new Error("No client or conversation ID available");
			}
			return client.getConversation({ conversationId });
		},
		enabled: !!client && !!conversationId,
		staleTime: 30 * 1000, // 30 seconds - individual conversations can change frequently
		gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
		retry: false, // Don't retry on error to match previous behavior
	});

	return {
		conversation: data?.conversation ?? null,
		isLoading,
		error: error as Error | null,
	};
}
