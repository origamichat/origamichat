import type { ChatConfig } from "../types";

export const createChatClient = (config: ChatConfig) => {
  // TODO: Implement actual chat client
  return {
    config,
    sendMessage: async (content: string) => {
      console.log("Sending message:", content);
      // Placeholder implementation
    },
  };
};
