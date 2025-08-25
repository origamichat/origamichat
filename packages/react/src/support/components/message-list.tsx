import type {
  AvailableAIAgent,
  AvailableHumanAgent,
  ConversationEvent,
  Message as MessageType,
  SenderType,
} from "@cossistant/types";
import type React from "react";
import {
  MessageListContainer,
  MessageList as PrimitiveMessageList,
} from "../../primitive/message-list";
import { useGroupedMessages } from "../hooks";
import { cn } from "../utils";
import { ConversationEvent as ConversationEventComponent } from "./conversation-event";
import { MessageGroup } from "./message-group";

export interface MessageListProps {
  messages: MessageType[];
  events: ConversationEvent[];
  isTyping?: {
    type: SenderType;
  };
  className?: string;
  availableAIAgents: AvailableAIAgent[];
  availableHumanAgents: AvailableHumanAgent[];
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  events = [],
  isTyping,
  className,
  availableAIAgents = [],
  availableHumanAgents = [],
}) => {
  // Use the hook to get grouped messages and events
  const groupedMessages = useGroupedMessages({
    messages,
    events,
    availableAIAgents,
    availableHumanAgents,
  });

  return (
    <PrimitiveMessageList
      autoScroll={true}
      className={cn(
        "overflow-y-auto scroll-smooth px-3 py-6",
        "scrollbar-thin scrollbar-thumb-co-background-300 scrollbar-track-transparent",
        "h-full w-full",
        className
      )}
      events={events}
      id="message-list"
      messages={messages}
    >
      <MessageListContainer className="flex min-h-full w-full flex-col gap-3">
        {groupedMessages.map((item, index) => {
          if (item.type === "event") {
            return (
              <ConversationEventComponent
                availableAIAgents={availableAIAgents}
                availableHumanAgents={availableHumanAgents}
                event={item.event}
                key={item.event.id}
              />
            );
          }
          return (
            <MessageGroup
              availableAIAgents={availableAIAgents}
              availableHumanAgents={availableHumanAgents}
              key={`group-${index}`}
              messages={item.messages}
            />
          );
        })}
        {/* {isTyping && (
          <TypingIndicator
            isAI={isTyping.type === SenderType.AI}
            senderImage={availableAgents[0]?.image || undefined}
            senderName={availableAgents[0]?.name || "Support"}
          />
        )} */}
      </MessageListContainer>
    </PrimitiveMessageList>
  );
};
