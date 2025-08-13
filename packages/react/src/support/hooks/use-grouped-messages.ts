import type {
  AvailableAIAgent,
  AvailableHumanAgent,
  ConversationEvent,
  Message as MessageType,
} from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { useMemo } from "react";

export interface GroupedMessage {
  type?: never; // Discriminant to distinguish from events
  senderId: string;
  senderType: SenderType;
  messages: MessageType[];
}

export interface ConversationEventItem {
  type: "event";
  event: ConversationEvent;
}

export interface UseGroupedMessagesProps {
  messages: MessageType[];
  events: ConversationEvent[];
  availableHumanAgents: AvailableHumanAgent[];
  availableAIAgents: AvailableAIAgent[];
}

// Helper function to determine sender ID and type from a message
const getSenderIdAndType = (
  message: MessageType
): { senderId: string; senderType: SenderType } => {
  if (message.visitorId) {
    return { senderId: message.visitorId, senderType: SenderType.VISITOR };
  }
  if (message.aiAgentId) {
    return { senderId: message.aiAgentId, senderType: SenderType.AI };
  }
  if (message.userId) {
    return { senderId: message.userId, senderType: SenderType.TEAM_MEMBER };
  }

  // Fallback - should not happen with proper data
  throw new Error("Message has no sender ID");
};

// Helper function to group messages by sender
const groupMessagesBySender = (messages: MessageType[]): GroupedMessage[] => {
  const groupedMessages: GroupedMessage[] = [];
  let currentGroup: GroupedMessage | null = null;

  for (const message of messages) {
    const { senderId, senderType } = getSenderIdAndType(message);

    if (currentGroup && currentGroup.senderId === senderId) {
      currentGroup.messages.push(message);
    } else {
      if (currentGroup) {
        groupedMessages.push(currentGroup);
      }

      currentGroup = {
        senderId,
        senderType,
        messages: [message],
      };
    }
  }

  if (currentGroup) {
    groupedMessages.push(currentGroup);
  }

  return groupedMessages;
};

// Helper function to get timestamp for sorting
const getItemTimestamp = (
  item: GroupedMessage | ConversationEventItem
): number => {
  if (item.type === "event") {
    return item.event.createdAt?.getTime() || 0;
  }
  return item.messages[0]?.createdAt?.getTime() || 0;
};

export const useGroupedMessages = ({
  messages,
  events = [],
  availableHumanAgents = [],
  availableAIAgents = [],
}: UseGroupedMessagesProps) => {
  return useMemo(() => {
    // Group messages by sender
    const groupedMessages = groupMessagesBySender(messages);

    // Convert events to have the discriminant type
    const eventsWithType: ConversationEventItem[] = events.map((event) => ({
      type: "event" as const,
      event,
    }));

    const allItems: (GroupedMessage | ConversationEventItem)[] = [
      ...groupedMessages,
      ...eventsWithType,
    ];

    // Sort by timestamp
    allItems.sort((a, b) => getItemTimestamp(a) - getItemTimestamp(b));

    return allItems;
  }, [messages, events]);
};
