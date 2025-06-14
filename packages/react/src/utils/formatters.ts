import type { ChatMessage } from "../types";

export const formatMessage = (message: ChatMessage): string => {
  // TODO: Implement message formatting
  return `[${message.type}] ${message.content}`;
};
