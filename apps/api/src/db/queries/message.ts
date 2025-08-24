import type { Database } from "@api/db";
import { message } from "@api/db/schema";
import { generateULID } from "@api/utils/db/ids";
import type { CreateMessageSchema } from "@cossistant/types";
import { desc, eq, and, lt } from "drizzle-orm";

export async function sendMessages(
  db: Database,
  params: {
    organizationId: string;
    websiteId: string;
    conversationId: string;
    messages: CreateMessageSchema[];
  }
) {
  // Make sure we have IDs for all messages
  const data = params.messages.map((m) => {
    // Validate that IDs are either null or valid ULIDs
    // Don't allow placeholder IDs like "default-team-0"
    const userId =
      m.userId && !m.userId.startsWith("default-") ? m.userId : null;
    const aiAgentId =
      m.aiAgentId && !m.aiAgentId.startsWith("default-") ? m.aiAgentId : null;
    const visitorId =
      m.visitorId && !m.visitorId.startsWith("default-") ? m.visitorId : null;

    const messageData = {
      id: m.id ?? generateULID(),
      bodyMd: m.bodyMd || "",
      type: m.type,
      userId,
      visitorId,
      organizationId: params.organizationId,
      conversationId: params.conversationId,
      aiAgentId,
      createdAt: m.createdAt,
      visibility: m.visibility,
    };

    return messageData;
  });

  console.log("data", data);

  // Insert messages
  const insertedMessages = await db.insert(message).values(data).returning();

  // TODO: Broadcast messages events to all connected clients

  return insertedMessages;
}

export async function getMessages(
  db: Database,
  params: {
    organizationId: string;
    conversationId: string;
    limit?: number;
    cursor?: string;
  }
) {
  const limit = params.limit ?? 50;
  
  // Build where clause
  const whereConditions = [
    eq(message.organizationId, params.organizationId),
    eq(message.conversationId, params.conversationId),
  ];
  
  // Add cursor condition if provided
  if (params.cursor) {
    whereConditions.push(lt(message.id, params.cursor));
  }
  
  // Fetch messages with pagination
  const messages = await db
    .select()
    .from(message)
    .where(and(...whereConditions))
    .orderBy(desc(message.createdAt))
    .limit(limit + 1); // Fetch one extra to determine if there's a next page
  
  // Determine if there's a next page
  const hasNextPage = messages.length > limit;
  const nextCursor = hasNextPage ? messages[limit - 1].id : undefined;
  
  // Remove the extra item if present
  if (hasNextPage) {
    messages.pop();
  }
  
  // Reverse to get chronological order (oldest first)
  messages.reverse();
  
  return {
    messages,
    nextCursor,
    hasNextPage,
  };
}
