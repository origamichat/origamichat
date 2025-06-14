import React from "react";
import type { ChatBubbleProps } from "../types";

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  className,
}) => {
  return (
    <div className={`chat-bubble ${className || ""}`}>
      {/* TODO: Implement chat bubble */}
      <p>{message.content}</p>
    </div>
  );
};
