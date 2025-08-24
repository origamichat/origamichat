import type { CossistantClient } from "@cossistant/core";
import type { ListConversationsResponse } from "@cossistant/types/api/conversation";
import { useQuery } from "@tanstack/react-query";

export interface UseConversationsResult {
  conversations: ListConversationsResponse["conversations"] | null;
  pagination: ListConversationsResponse["pagination"] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useConversations(
  client: CossistantClient | null,
  params: { limit?: number; enabled?: boolean } = {}
): UseConversationsResult {
  const isEnabled = !!client && params.enabled !== false;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "conversations",
      client?.getConfiguration().publicKey,
      params.limit || 5,
    ],
    queryFn: async () => {
      if (!client) {
        throw new Error("No client available");
      }

      return client.listConversations({
        limit: params.limit || 5,
        orderBy: "updatedAt",
        order: "desc",
      });
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - conversations can change
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: false, // Don't retry on error to match previous behavior
  });

  console.log("useConversations state:", {
    isEnabled,
    isLoading,
    hasData: !!data,
    error: error?.message,
    client: !!client,
    enabled: params.enabled,
  });

  return {
    conversations: data?.conversations ?? null,
    pagination: data?.pagination ?? null,
    isLoading,
    error: error as Error | null,
  };
}
