import { useChatContext } from "../components/ChatProvider";
import type { ChatMessage } from "../types";

export const useChat = () => {
  const context = useChatContext();

  return {
    messages: context.messages,
    sendMessage: context.sendMessage,
    isLoading: context.isLoading,
    error: context.error,
  };
};
