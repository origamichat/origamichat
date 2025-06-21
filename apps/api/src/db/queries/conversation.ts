import { eq, and, desc, isNull, like, count, inArray } from "drizzle-orm";
import {
  conversation,
  type Database,
  type ConversationInsert,
} from "@origamichat/database";

import { ConversationStatus, ConversationPriority } from "@origamichat/database/enums";

// Create conversation
export async function createConversation(
  db: Database,
  params: {
    orgId: string;
    data: Omit<ConversationInsert, "organizationId">;
  }
) {
  const [newConversation] = await db
    .insert(conversation)
    .values({
      ...params.data,
      organizationId: params.orgId,
    })
    .returning();

  return newConversation;
}

// Get conversation by ID (with org check)
export async function getConversationById(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
  }
) {
  const [conversationData] = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId),
        isNull(conversation.deletedAt)
      )
    )
    .limit(1);

  return conversationData;
}

// Get conversations for organization
export async function getConversationsByOrganization(
  db: Database,
  params: {
    orgId: string;
    status?: ConversationStatus;
    priority?: ConversationPriority;
    assignedTeamMemberId?: string;
    websiteId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const conversations = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.organizationId, params.orgId),
        params.status ? eq(conversation.status, params.status) : undefined,
        params.priority
          ? eq(conversation.priority, params.priority)
          : undefined,
        params.assignedTeamMemberId
          ? eq(conversation.assignedTeamMemberId, params.assignedTeamMemberId)
          : undefined,
        params.websiteId
          ? eq(conversation.websiteId, params.websiteId)
          : undefined,
        isNull(conversation.deletedAt)
      )
    )
    .orderBy(desc(conversation.lastMessageAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return conversations;
}

// Get conversations by visitor
export async function getConversationsByVisitor(
  db: Database,
  params: {
    orgId: string;
    visitorId: string;
    limit?: number;
    offset?: number;
  }
) {
  const conversations = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.organizationId, params.orgId),
        eq(conversation.visitorId, params.visitorId),
        isNull(conversation.deletedAt)
      )
    )
    .orderBy(desc(conversation.createdAt))
    .limit(params.limit ?? 10)
    .offset(params.offset ?? 0);

  return conversations;
}

// Get open conversations (not resolved)
export async function getOpenConversations(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
    assignedTeamMemberId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const conversations = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.organizationId, params.orgId),
        eq(conversation.status, ConversationStatus.OPEN),
        params.websiteId
          ? eq(conversation.websiteId, params.websiteId)
          : undefined,
        params.assignedTeamMemberId
          ? eq(conversation.assignedTeamMemberId, params.assignedTeamMemberId)
          : undefined,
        isNull(conversation.deletedAt)
      )
    )
    .orderBy(desc(conversation.lastMessageAt))
    .limit(params.limit ?? 50)
    .offset(params.offset ?? 0);

  return conversations;
}

// Get urgent conversations
export async function getUrgentConversations(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const conversations = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.organizationId, params.orgId),
        eq(conversation.priority, ConversationPriority.URGENT),
        inArray(conversation.status, [
          ConversationStatus.OPEN,
          ConversationStatus.PENDING,
        ]),
        params.websiteId
          ? eq(conversation.websiteId, params.websiteId)
          : undefined,
        isNull(conversation.deletedAt)
      )
    )
    .orderBy(desc(conversation.lastMessageAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  return conversations;
}

// Search conversations by title
export async function searchConversations(
  db: Database,
  params: {
    orgId: string;
    query: string;
    websiteId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const conversations = await db
    .select()
    .from(conversation)
    .where(
      and(
        eq(conversation.organizationId, params.orgId),
        like(conversation.title, `%${params.query}%`),
        params.websiteId
          ? eq(conversation.websiteId, params.websiteId)
          : undefined,
        isNull(conversation.deletedAt)
      )
    )
    .orderBy(desc(conversation.lastMessageAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  return conversations;
}

// Update conversation
export async function updateConversation(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
    data: Partial<Omit<ConversationInsert, "organizationId">>;
  }
) {
  const [updatedConversation] = await db
    .update(conversation)
    .set({
      ...params.data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedConversation;
}

// Assign conversation to team member
export async function assignConversation(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
    assignedTeamMemberId: string;
  }
) {
  const [assignedConversation] = await db
    .update(conversation)
    .set({
      assignedTeamMemberId: params.assignedTeamMemberId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return assignedConversation;
}

// Update conversation status
export async function updateConversationStatus(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
    status: ConversationStatus;
    resolutionTime?: number;
  }
) {
  const [updatedConversation] = await db
    .update(conversation)
    .set({
      status: params.status,
      resolutionTime: params.resolutionTime,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedConversation;
}

// Update conversation priority
export async function updateConversationPriority(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
    priority: ConversationPriority;
  }
) {
  const [updatedConversation] = await db
    .update(conversation)
    .set({
      priority: params.priority,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedConversation;
}

// Update last message timestamp
export async function updateConversationLastMessage(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
  }
) {
  const [updatedConversation] = await db
    .update(conversation)
    .set({
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return updatedConversation;
}

// Soft delete conversation
export async function deleteConversation(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
  }
) {
  const [deletedConversation] = await db
    .update(conversation)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return deletedConversation;
}

// Restore conversation
export async function restoreConversation(
  db: Database,
  params: {
    orgId: string;
    conversationId: string;
  }
) {
  const [restoredConversation] = await db
    .update(conversation)
    .set({
      deletedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(conversation.id, params.conversationId),
        eq(conversation.organizationId, params.orgId)
      )
    )
    .returning();

  return restoredConversation;
}

// Get conversation statistics
export async function getConversationStats(
  db: Database,
  params: {
    orgId: string;
    websiteId?: string;
  }
) {
  const stats = await db
    .select({
      total: count(),
      open: count(eq(conversation.status, ConversationStatus.OPEN)),
      resolved: count(eq(conversation.status, ConversationStatus.RESOLVED)),
      urgent: count(eq(conversation.priority, ConversationPriority.URGENT)),
    })
    .from(conversation)
    .where(
      and(
        eq(conversation.organizationId, params.orgId),
        params.websiteId
          ? eq(conversation.websiteId, params.websiteId)
          : undefined,
        isNull(conversation.deletedAt)
      )
    );

  return stats[0];
}
