import type { CossistantClient, CossistantRestClient } from "@cossistant/core";
import { generateConversationId } from "@cossistant/core";
import type {
  CreateConversationRequestBody,
  CreateConversationResponseBody,
} from "@cossistant/types/api/conversation";
import type { Conversation, Message } from "@cossistant/types/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseCreateConversationOptions {
  onSuccess?: (data: CreateConversationResponseBody) => void;
  onError?: (error: Error) => void;
}

export function useCreateConversation(
  client: CossistantClient | CossistantRestClient | null,
  options?: UseCreateConversationOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: Partial<CreateConversationRequestBody> = {}) => {
      if (!client) {
        throw new Error("No client available");
      }

      // Generate conversation ID client-side for optimistic updates
      const conversationId = params.conversationId || generateConversationId();

      // Create the conversation
      const response = await client.createConversation({
        ...params,
        conversationId,
      });

      return response;
    },
    onMutate: async (params) => {
      // Generate conversation ID for optimistic update
      const conversationId = params?.conversationId || generateConversationId();

      // Optimistically add the conversation to the cache
      const optimisticConversation: Conversation = {
        id: conversationId,
        title: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        visitorId: "",
        websiteId: "",
        status: "open",
      };

      // Set optimistic data in query cache
      queryClient.setQueryData<Conversation>(
        ["conversation", conversationId],
        optimisticConversation
      );

      // Also update the conversations list if it exists
      queryClient.setQueryData<Conversation[]>(["conversations"], (old) => [
        ...(old || []),
        optimisticConversation,
      ]);

      return { conversationId };
    },
    onSuccess: (data, variables, context) => {
      // Update the conversation with server data
      queryClient.setQueryData<Conversation>(
        ["conversation", data.conversation.id],
        data.conversation
      );

      // Update conversations list
      queryClient.setQueryData<Conversation[]>(["conversations"], (old) => {
        if (!old) {
          return [data.conversation];
        }

        // Replace optimistic conversation with real one
        const index = old.findIndex((c) => c.id === data.conversation.id);
        if (index >= 0) {
          const updated = [...old];
          updated[index] = data.conversation;
          return updated;
        }
        return [...old, data.conversation];
      });

      // Set initial messages if any
      if (data.initialMessages.length > 0) {
        queryClient.setQueryData<Message[]>(
          ["messages", data.conversation.id],
          data.initialMessages
        );
      }

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context) => {
      // Remove optimistic conversation on error
      if (context?.conversationId) {
        queryClient.removeQueries({
          queryKey: ["conversation", context.conversationId],
        });

        // Remove from list
        queryClient.setQueryData<Conversation[]>(
          ["conversations"],
          (old) => old?.filter((c) => c.id !== context.conversationId) || []
        );
      }

      // Call user's onError callback
      options?.onError?.(error as Error);
    },
  });
}
