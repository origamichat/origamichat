import type { CossistantClient } from "@cossistant/core";
import type { Conversation } from "@cossistant/types/schemas";
import { useQuery } from "@tanstack/react-query";

export function useConversation(
	client: CossistantClient | null,
	conversationId: string | null
) {
	return useQuery({
		queryKey: ["conversation", conversationId],
		queryFn: async () => {
			if (!(client && conversationId)) {
				throw new Error("Client and conversation ID required");
			}

			// For now, return the cached data since we don't have a GET endpoint yet
			// In the future, this would call: client.rest.getConversation(conversationId)
			return null as Conversation | null;
		},
		enabled: !!client && !!conversationId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}
