import { useChatContext } from "../components/ChatProvider";

export const useMessages = () => {
  const { messages, clearMessages } = useChatContext();

  return {
    messages,
    clearMessages,
  };
};
