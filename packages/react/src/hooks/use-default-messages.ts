import { useSupport } from "@cossistant/react/provider";
import {
  type Message,
  MessageType,
  MessageVisibility,
  SenderType,
} from "@cossistant/types";
import { useMemo } from "react";

export function useDefaultMessages({
  conversationId,
}: {
  conversationId: string;
}): Message[] {
  const { defaultMessages, availableAIAgents, availableHumanAgents } =
    useSupport();

  const memoisedDefaultMessages = useMemo(
    () =>
      defaultMessages.map((message, index) => {
        const messageId = `default-message-${index}`;
        return {
          content: message.content,
          type: MessageType.TEXT,
          id: messageId,
          createdAt: new Date(),
          conversationId,
          updatedAt: new Date(),
          deletedAt: null,
          userId:
            message.senderType === SenderType.TEAM_MEMBER
              ? message.senderId ||
                availableHumanAgents[0]?.id ||
                `default-team-${index}`
              : null,
          aiAgentId:
            message.senderType === SenderType.AI
              ? message.senderId ||
                availableAIAgents[0]?.id ||
                `default-ai-${index}`
              : null,
          visitorId:
            message.senderType === SenderType.VISITOR
              ? message.senderId || `default-visitor-${index}`
              : null,
          visibility: MessageVisibility.PUBLIC,
        };
      }),
    [
      defaultMessages,
      availableHumanAgents[0]?.id,
      availableAIAgents[0]?.id,
      conversationId,
    ]
  );

  return memoisedDefaultMessages;
}
