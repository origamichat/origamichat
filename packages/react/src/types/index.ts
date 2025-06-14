import { ReactNode } from "react";

export interface ChatMessage {
  id: string;
  content: string;
  type: "user" | "assistant" | "system";
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  userId?: string;
  status: "active" | "waiting" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatConfig {
  apiKey: string;
  apiUrl?: string;
  userId?: string;
  metadata?: Record<string, any>;
  appearance?: ChatAppearance;
}

export interface ChatAppearance {
  theme?: "light" | "dark" | "auto";
  primaryColor?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

export interface ChatContextValue {
  messages: ChatMessage[];
  session?: ChatSession;
  isLoading: boolean;
  error?: string;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  config: ChatConfig;
}

export interface SupportProps {
  config: ChatConfig;
  children?: ReactNode;
  className?: string;
}

export interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface MessageListProps {
  messages: ChatMessage[];
  className?: string;
}

export interface ChatBubbleProps {
  message: ChatMessage;
  className?: string;
}

export interface ChatStatusProps {
  status: ChatSession["status"];
  className?: string;
}
