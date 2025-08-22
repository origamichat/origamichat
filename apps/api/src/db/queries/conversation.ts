import type { Database } from "@api/db";
import { conversation } from "@api/db/schema";
import { generateShortPrimaryId } from "@api/utils/db/ids";
import { ConversationStatus } from "@cossistant/types";
import { and, asc, count, desc, eq } from "drizzle-orm";

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
	const limit = params.limit ?? 6;
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
			// Note: "archived" doesn't have a direct DB equivalent yet
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

	const totalPages = Math.ceil(totalCount / limit);

	return {
		conversations,
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

	return _conversation;
}
