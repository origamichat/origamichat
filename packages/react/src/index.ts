// Main exports
export { Support } from "./components/Support";
export { ChatProvider, useChatContext } from "./components/ChatProvider";
export { MessageInput } from "./components/MessageInput";
export { MessageList } from "./components/MessageList";
export { ChatBubble } from "./components/ChatBubble";
export { ChatStatus } from "./components/ChatStatus";

// Hooks
export { useChat } from "./hooks/useChat";
export { useMessages } from "./hooks/useMessages";
export { useChatSession } from "./hooks/useChatSession";

// Types
export type * from "./types";

// Utils (for advanced usage)
export { createChatClient } from "./utils/client";
export { formatMessage } from "./utils/formatters";
