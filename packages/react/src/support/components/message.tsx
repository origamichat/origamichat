import type { Message as MessageType } from "@cossistant/types";
import type React from "react";
import {
  MessageContent,
  MessageTimestamp,
  Message as PrimitiveMessage,
} from "../../primitive/message";
import { cn } from "../utils";

export interface MessageProps {
  message: MessageType;
  isLast?: boolean;
}

export function Message({ message, isLast = false }: MessageProps) {
  return (
    <PrimitiveMessage message={message}>
      {({ isVisitor, isAI, timestamp }) => (
        <div
          className={cn(
            "flex w-full gap-2",
            isVisitor && "flex-row-reverse",
            !isVisitor && "flex-row"
          )}
        >
          <div
            className={cn(
              "flex w-full flex-1 flex-col gap-1",
              isVisitor && "items-end"
            )}
          >
            <MessageContent
              bodyMd={message.bodyMd}
              className={cn(
                "block w-max max-w-[300px] rounded-lg px-3 py-2 text-sm",
                isVisitor && "rounded-br-sm bg-primary text-primary-foreground",
                !isVisitor &&
                  "rounded-bl-sm bg-co-background-200 text-foreground dark:bg-co-background-500"
              )}
              renderMarkdown
            />
            {isLast && (
              <MessageTimestamp
                className="px-1 text-muted-foreground text-xs"
                timestamp={timestamp}
              >
                {() => (
                  <>
                    {timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isAI && " • AI agent"}
                  </>
                )}
              </MessageTimestamp>
            )}
          </div>
        </div>
      )}
    </PrimitiveMessage>
  );
}
