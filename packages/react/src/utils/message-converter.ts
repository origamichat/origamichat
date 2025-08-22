import { generateMessageId } from "@cossistant/core";
import { MessageType, MessageVisibility, SenderType } from "@cossistant/types";
import type { CreateMessageSchema } from "@cossistant/types/api/messages";
import type { Message } from "@cossistant/types/schemas";
import type { DefaultMessage } from "../provider";

/**
 * Converts DefaultMessage array to CreateMessageSchema array for API submission
 */
export function defaultMessagesToCreateMessages(
  defaultMessages: DefaultMessage[],
  conversationId: string,
  visitorId?: string
): CreateMessageSchema[] {
  return defaultMessages.map((msg) => ({
    id: generateMessageId(),
    bodyMd: msg.content,
    type: MessageType.TEXT,
    userId:
      msg.senderType === SenderType.TEAM_MEMBER ? msg.senderId || null : null,
    aiAgentId: msg.senderType === SenderType.AI ? msg.senderId || null : null,
    visitorId: msg.senderType === SenderType.VISITOR ? visitorId || null : null,
    conversationId,
    createdAt: new Date(),
    visibility: MessageVisibility.PUBLIC,
  }));
}

/**
 * Converts DefaultMessage array to Message array for local state
 */
export function defaultMessagesToMessages(
  defaultMessages: DefaultMessage[],
  conversationId: string,
  visitorId?: string
): Message[] {
  const now = new Date();

  return defaultMessages.map((msg, index) => {
    // Create timestamps with small increments to maintain order
    const createdAt = new Date(now.getTime() + index);

    return {
      id: generateMessageId(),
      bodyMd: msg.content,
      type: MessageType.TEXT,
      userId:
        msg.senderType === SenderType.TEAM_MEMBER ? msg.senderId || null : null,
      aiAgentId: msg.senderType === SenderType.AI ? msg.senderId || null : null,
      visitorId:
        msg.senderType === SenderType.VISITOR ? visitorId || null : null,
      conversationId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
      visibility: MessageVisibility.PUBLIC,
    };
  });
}

/**
 * Helper to generate a message ID if not provided
 */
export { generateMessageId } from "@cossistant/core";
