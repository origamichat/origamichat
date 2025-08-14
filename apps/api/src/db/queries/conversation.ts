import type { Database } from "@api/db";
import { conversation } from "@api/db/schema";
import { generateShortPrimaryId } from "@api/utils/db/ids";
import { ConversationStatus } from "@cossistant/types";

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
