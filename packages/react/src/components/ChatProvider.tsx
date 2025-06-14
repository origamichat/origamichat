import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  ChatConfig,
  ChatContextValue,
  ChatMessage,
  ChatSession,
} from "../types";

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChatContext = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  config: ChatConfig;
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  config,
  children,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        content,
        type: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // TODO: Implement actual API call
      // For now, simulate a response
      setTimeout(() => {
        const response: ChatMessage = {
          id: `msg_${Date.now()}_response`,
          content: `Thank you for your message: "${content}". A support agent will be with you shortly.`,
          type: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value: ChatContextValue = {
    messages,
    session,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    config,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
