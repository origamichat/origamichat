import React from "react";
import type { MessageListProps } from "../types";

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  className,
}) => {
  return (
    <div className={`message-list ${className || ""}`}>
      {/* TODO: Implement message list */}
      <p>Messages will appear here ({messages.length} messages)</p>
    </div>
  );
};
