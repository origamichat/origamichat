import { generateMessageId } from "@cossistant/core";
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
        const messageId = generateMessageId();

        return {
          bodyMd: message.content,
          type: MessageType.TEXT,
          id: messageId,
          createdAt: new Date(),
          conversationId,
          updatedAt: new Date(),
          deletedAt: null,
          userId:
            message.senderType === SenderType.TEAM_MEMBER
              ? message.senderId || availableHumanAgents[0]?.id || null
              : null,
          aiAgentId:
            message.senderType === SenderType.AI
              ? message.senderId || availableAIAgents[0]?.id || null
              : null,
          visitorId:
            message.senderType === SenderType.VISITOR
              ? message.senderId || null
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
