import type { CossistantClient } from "@cossistant/core";
import type { Message } from "@cossistant/types/schemas";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useMessages(
	client: CossistantClient | null,
	conversationId: string | null
) {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: ["messages", conversationId],
		queryFn: async () => {
			if (!(client && conversationId)) {
				throw new Error("Client and conversation ID required");
			}

			// For now, return empty array or cached data
			// In the future, this would call: client.rest.getMessages(conversationId)
			const cached = queryClient.getQueryData<Message[]>([
				"messages",
				conversationId,
			]);
			return cached || [];
		},
		enabled: !!client && !!conversationId,
		staleTime: 1 * 60 * 1000, // 1 minute
		gcTime: 5 * 60 * 1000, // 5 minutes
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
