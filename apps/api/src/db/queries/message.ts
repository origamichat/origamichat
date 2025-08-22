import type { Database } from "@api/db";
import { message } from "@api/db/schema";
import { generateULID } from "@api/utils/db/ids";
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
