import {
  eq,
  and,
  desc,
  asc,
  isNull,
  like,
  or,
  count,
  gte,
  lte,
  inArray,
} from "drizzle-orm";
import {
  message,
  MessageType,
  SenderType,
  type Database,
  type MessageSelect,
  type MessageInsert,
} from "@repo/database";

// Create message
export async function createMessage(
  db: Database,
  params: {
    orgId: string;
    data: Omit<MessageInsert, "organizationId">;
  }
) {
  const [newMessage] = await db
    .insert(message)
    .values({
      ...params.data,
      organizationId: params.orgId,
    })
    .returning();

  return newMessage;
}

// Get message by ID (with org check)
export async function getMessageById(
  db: Database,
  params: {
    orgId: string;
    messageId: string;
  }
) {
  const [messageData] = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId),
        isNull(message.deletedAt)
      )
    )
    .limit(1);

  return messageData;
}

// Get messages by conversation
export async function getMessagesByConversation(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        eq(message.conversationId, params.conversationId),
        isNull(message.deletedAt)
      )
    )
    .orderBy(asc(message.createdAt))
    .limit(params.limit ?? 100)
    .offset(params.offset ?? 0);

  return messages;
}

// Get recent messages for organization
export async function getRecentMessages(
  db: Database,
  params: {
    orgId: string;
    conversationId?: string;
    senderType?: SenderType;
    messageType?: MessageType;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        params.conversationId
          ? eq(message.conversationId, params.conversationId)
          : undefined,
        params.senderType
          ? eq(message.senderType, params.senderType)
          : undefined,
        params.messageType ? eq(message.type, params.messageType) : undefined,
        isNull(message.deletedAt)
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return messages;
}

// Get messages by sender
export async function getMessagesBySender(
  db: Database,
  params: {
    orgId: string;
    senderId: string;
    senderType: SenderType;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        eq(message.senderId, params.senderId),
        eq(message.senderType, params.senderType),
        isNull(message.deletedAt)
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return messages;
}

// Get messages by AI agent
export async function getMessagesByAiAgent(
  db: Database,
  params: {
    orgId: string;
    aiAgentId: string;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        eq(message.aiAgentId, params.aiAgentId),
        isNull(message.deletedAt)
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return messages;
}

// Get thread messages (parent-child relationships)
export async function getThreadMessages(
  db: Database,
  params: {
    orgId: string;
    parentMessageId: string;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        eq(message.parentMessageId, params.parentMessageId),
        isNull(message.deletedAt)
      )
    )
    .orderBy(asc(message.createdAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  return messages;
}

// Search messages by content
export async function searchMessages(
  db: Database,
  params: {
    orgId: string;
    query: string;
    conversationId?: string;
    senderType?: SenderType;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        like(message.content, `%${params.query}%`),
        params.conversationId
          ? eq(message.conversationId, params.conversationId)
          : undefined,
        params.senderType
          ? eq(message.senderType, params.senderType)
          : undefined,
        isNull(message.deletedAt)
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  return messages;
}

// Get messages by type (text, image, file)
export async function getMessagesByType(
  db: Database,
  params: {
    orgId: string;
    messageType: MessageType;
    conversationId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const messages = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.organizationId, params.orgId),
        eq(message.type, params.messageType),
        params.conversationId
          ? eq(message.conversationId, params.conversationId)
          : undefined,
        isNull(message.deletedAt)
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return messages;
}

// Update message
export async function updateMessage(
  db: Database,
  params: {
    orgId: string;
    messageId: string;
    data: Partial<Omit<MessageInsert, "organizationId">>;
  }
) {
  const [updatedMessage] = await db
    .update(message)
    .set({
      ...params.data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedMessage;
}

// Add reaction to message
export async function addMessageReaction(
  db: Database,
  params: {
    orgId: string;
    messageId: string;
    userId: string;
    reaction: string;
  }
) {
  // First get the current reactions
  const [currentMessage] = await db
    .select({ reactions: message.reactions })
    .from(message)
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .limit(1);

  if (!currentMessage) return null;

  const reactions = (currentMessage.reactions as Record<string, string>) || {};
  reactions[params.userId] = params.reaction;

  const [updatedMessage] = await db
    .update(message)
    .set({
      reactions,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedMessage;
}

// Remove reaction from message
export async function removeMessageReaction(
  db: Database,
  params: {
    orgId: string;
    messageId: string;
    userId: string;
  }
) {
  // First get the current reactions
  const [currentMessage] = await db
    .select({ reactions: message.reactions })
    .from(message)
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .limit(1);

  if (!currentMessage) return null;

  const reactions = (currentMessage.reactions as Record<string, string>) || {};
  delete reactions[params.userId];

  const [updatedMessage] = await db
    .update(message)
    .set({
      reactions,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedMessage;
}

// Soft delete message
export async function deleteMessage(
  db: Database,
  params: {
    orgId: string;
    messageId: string;
  }
) {
  const [deletedMessage] = await db
    .update(message)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .returning();

  return deletedMessage;
}

// Restore message
export async function restoreMessage(
  db: Database,
  params: {
    orgId: string;
    messageId: string;
  }
) {
  const [restoredMessage] = await db
    .update(message)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(message.id, params.messageId),
        eq(message.organizationId, params.orgId)
      )
    )
    .returning();

  return restoredMessage;
}
