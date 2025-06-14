import React from "react";
import type { ChatStatusProps } from "../types";

export const ChatStatus: React.FC<ChatStatusProps> = ({
  status,
  className,
}) => {
  return (
    <div className={`chat-status ${className || ""}`}>
      {/* TODO: Implement chat status */}
      <span>Status: {status}</span>
    </div>
  );
};
