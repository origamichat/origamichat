import type { Database } from "@api/db";
import { message } from "@api/db/schema";
import { generateULID } from "@api/utils/db/ids";
import { prepareMessageForInsert } from "@api/utils/message";
import type { CreateMessageSchema } from "@cossistant/types";

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
    const { mentionsIndex, bodyMd } = prepareMessageForInsert(m.content);

    return {
      id: m.id ?? generateULID(),
      organizationId: params.organizationId,
      websiteId: params.websiteId,
      conversationId: params.conversationId,
      type: m.type,
      userId: m.userId,
      aiAgentId: m.aiAgentId,
      visitorId: m.visitorId,
      createdAt: m.createdAt,
      visibility: m.visibility,
      // Computed body and mentions index
      mentionsIndex,
      bodyMd,
    };
  });

  // Insert messages
  const insertedMessages = await db.insert(message).values(data).returning();

  // TODO: Broadcast messages events to all connected clients

  return insertedMessages;
}
