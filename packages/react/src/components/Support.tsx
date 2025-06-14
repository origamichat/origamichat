import React from "react";
import { ChatProvider } from "./ChatProvider";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatStatus } from "./ChatStatus";
import { useChatContext } from "./ChatProvider";
import type { SupportProps } from "../types";

const SupportWidget: React.FC = () => {
  const { messages, session, isLoading, sendMessage } = useChatContext();

  return (
    <div className="origami-support-widget">
      <div className="origami-chat-container">
        <div className="origami-chat-header">
          <h3>Support Chat</h3>
          {session && <ChatStatus status={session.status} />}
        </div>

        <MessageList messages={messages} />

        <MessageInput
          onSend={sendMessage}
          disabled={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
};

export const Support: React.FC<SupportProps> = ({
  config,
  children,
  className,
}) => {
  return (
    <ChatProvider config={config}>
      <div className={`origami-support ${className || ""}`}>
        {children || <SupportWidget />}
      </div>
    </ChatProvider>
  );
};
