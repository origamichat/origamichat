import type { CossistantClient } from "@cossistant/core";
import type {
  GetMessagesResponse,
  SendMessageRequest,
} from "@cossistant/types/api/message";
import type { Message } from "@cossistant/types/schemas";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { PENDING_CONVERSATION_ID } from "../../utils/id";
import {
  addMessageToCache,
  type PaginatedMessagesCache,
} from "../utils/message-cache";

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
  const hasRealConversation =
    Boolean(conversationId) && conversationId !== PENDING_CONVERSATION_ID;

  const query = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }) => {
      if (!(client && conversationId)) {
        throw new Error("Client and conversation ID required");
      }

      // For pending conversations, return default messages as a single page
      if (!hasRealConversation) {
        return {
          messages: defaultMessages,
          nextCursor: undefined,
          hasNextPage: false,
        } as GetMessagesResponse;
      }

      // For real conversations, fetch from server
      const response = await client.getConversationMessages({
        conversationId,
        cursor: pageParam,
        limit: 50,
      });

      return response;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(client && conversationId),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  // Flatten all pages into a single array of messages
  const messages = query.data?.pages?.flatMap((page) => page.messages) ?? [];

  return {
    ...query,
    data: messages,
  };
}

// Hook to send a message
export function useSendMessage(
  client: CossistantClient | null,
  conversationId: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: SendMessageRequest["message"]) => {
      if (!client) {
        throw new Error("Client required");
      }
      if (!conversationId) {
        throw new Error("Conversation ID required");
      }

      const response = await client.sendMessage({
        conversationId,
        message,
      });

      return response.message;
    },
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<PaginatedMessagesCache>(
        ["messages", conversationId]
      );

      // Optimistically update to the new value
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        bodyMd: newMessage.bodyMd,
        type: newMessage.type || "text",
        userId: newMessage.userId || null,
        visitorId: newMessage.visitorId || null,
        aiAgentId: newMessage.aiAgentId || null,
        visibility: newMessage.visibility || "public",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        conversationId: conversationId || "",
      };

      // Add the optimistic message to the cache
      queryClient.setQueryData<PaginatedMessagesCache>(
        ["messages", conversationId],
        (old) => addMessageToCache(old, optimisticMessage)
      );

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      // If mutation fails, use the context to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", conversationId],
          context.previousMessages
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    },
  });
}
