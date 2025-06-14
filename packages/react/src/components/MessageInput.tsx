import React from "react";
import type { MessageInputProps } from "../types";

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled,
  placeholder,
  className,
}) => {
  return (
    <div className={`message-input ${className || ""}`}>
      {/* TODO: Implement message input */}
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        onKeyPress={(e) => {
          if (e.key === "Enter" && e.currentTarget.value) {
            onSend(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};
