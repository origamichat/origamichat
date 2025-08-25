import type { Database } from "@api/db";
import { conversation, type MessageSelect, message } from "@api/db/schema";
import { generateShortPrimaryId } from "@api/utils/db/ids";
import {
  ConversationStatus,
  MessageType,
  MessageVisibility,
} from "@cossistant/types";
import { and, asc, count, desc, eq, inArray, isNull } from "drizzle-orm";

export async function upsertConversation(
  db: Database,
  params: {
    organizationId: string;
    websiteId: string;
    visitorId: string;
    conversationId?: string;
  }
) {
  const newConversationId = params.conversationId ?? generateShortPrimaryId();
  const now = new Date();

  // Upsert conversation
  const [_conversation] = await db
    .insert(conversation)
    .values({
      id: newConversationId,
      organizationId: params.organizationId,
      websiteId: params.websiteId,
      visitorId: params.visitorId,
      status: ConversationStatus.OPEN,
      createdAt: now,
    })
    .onConflictDoNothing({
      target: conversation.id,
    })
    .returning();

  return _conversation;
}

export async function listConversations(
  db: Database,
  params: {
    organizationId: string;
    websiteId: string;
    visitorId: string;
    page?: number;
    limit?: number;
    status?: "open" | "closed";
    orderBy?: "createdAt" | "updatedAt";
    order?: "asc" | "desc";
  }
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 3;
  const offset = (page - 1) * limit;
  const orderBy = params.orderBy ?? "updatedAt";
  const order = params.order ?? "desc";

  // Build where conditions
  const whereConditions = [
    eq(conversation.organizationId, params.organizationId),
    eq(conversation.websiteId, params.websiteId),
    eq(conversation.visitorId, params.visitorId),
  ];

  if (params.status) {
    // Map API status to database status
    const statusMap: Record<string, ConversationStatus> = {
      open: ConversationStatus.OPEN,
      closed: ConversationStatus.RESOLVED,
    };

    const dbStatus = statusMap[params.status];
    if (dbStatus) {
      whereConditions.push(eq(conversation.status, dbStatus));
    }
  }

  // Get total count
  const [{ totalCount }] = await db
    .select({ totalCount: count() })
    .from(conversation)
    .where(and(...whereConditions));

  // Get paginated conversations
  const orderColumn =
    orderBy === "createdAt" ? conversation.createdAt : conversation.updatedAt;
  const orderFn = order === "desc" ? desc : asc;

  const conversations = await db
    .select()
    .from(conversation)
    .where(and(...whereConditions))
    .orderBy(orderFn(orderColumn))
    .limit(limit)
    .offset(offset);

  // Get conversation IDs for fetching last messages
  const conversationIds = conversations.map((c) => c.id);

  // Fetch last messages for each conversation if there are any conversations
  const lastMessagesMap: Record<string, MessageSelect> = {};

  if (conversationIds.length > 0) {
    // Get all messages for the conversations and group by conversation ID
    const messages = await db
      .select()
      .from(message)
      .where(
        and(
          eq(message.organizationId, params.organizationId),
          inArray(message.conversationId, conversationIds),
          eq(message.visibility, MessageVisibility.PUBLIC),
          eq(message.type, MessageType.TEXT),
          isNull(message.deletedAt)
        )
      )
      .orderBy(desc(message.createdAt));

    // Group messages by conversation and take the first (latest) one for each
    for (const msg of messages) {
      if (!lastMessagesMap[msg.conversationId]) {
        lastMessagesMap[msg.conversationId] = msg;
      }
    }
  }

  // Add lastMessage to each conversation
  const conversationsWithLastMessage = conversations.map((conv) => ({
    ...conv,
    lastMessage: lastMessagesMap[conv.id] || undefined,
  }));

  const totalPages = Math.ceil(totalCount / limit);

  return {
    conversations: conversationsWithLastMessage,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

export async function getConversationById(
  db: Database,
  params: {
    organizationId: string;
    websiteId: string;
    conversationId: string;
  }
) {
  const [_conversation] = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.organizationId),
        eq(conversation.websiteId, params.websiteId)
      )
    );

  if (!_conversation) {
    return;
  }

  // Fetch the last message for this conversation
  const [lastMessage] = await db
    .select()
    .from(message)
    .where(
      and(
        eq(message.conversationId, params.conversationId),
        eq(message.organizationId, params.organizationId),
        eq(message.visibility, MessageVisibility.PUBLIC),
        eq(message.type, MessageType.TEXT),
        isNull(message.deletedAt)
      )
    )
    .orderBy(desc(message.createdAt))
    .limit(1);

  return {
    ..._conversation,
    lastMessage: lastMessage || undefined,
  };
}
