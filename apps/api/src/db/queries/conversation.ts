import type { Database } from "@api/db";
import {
	type ConversationSelect,
	conversation,
	type MessageSelect,
	message,
} from "@api/db/schema";
import { and, desc, eq, inArray, isNull, lt, or } from "drizzle-orm";

type CursorPayload = {
	updatedAtISO: string;
	id: string;
};

function encodeCursor(payload: CursorPayload): string {
	return `${payload.updatedAtISO}|${payload.id}`;
}

function decodeCursor(cursor: string): CursorPayload | null {
	const [updatedAtISO, id] = cursor.split("|");
	if (!updatedAtISO) {
		return null;
	}
	if (!id) {
		return null;
	}
	return { updatedAtISO, id };
}

export type ConversationListItem = ConversationSelect & {
	lastMessagePreview: string | null;
};

export type GetConversationsParams = {
	websiteId: string;
	limit?: number;
	cursor?: string | null;
};

function buildCursorWhereClause(
	decoded: CursorPayload | null,
	cursorDate: Date | null,
	cursorId: string | null
): ReturnType<typeof or> | undefined {
	if (!decoded) {
		return;
	}
	if (!cursorDate) {
		return;
	}
	if (!cursorId) {
		return;
	}
	return or(
		lt(conversation.updatedAt, cursorDate),
		and(eq(conversation.updatedAt, cursorDate), lt(conversation.id, cursorId))
	);
}

function computeNextCursor(page: ConversationSelect[]): string | null {
	if (page.length === 0) {
		return null;
	}
	const over = page.pop();
	if (!over) {
		return null;
	}
	const nextDate = over.updatedAt ?? over.createdAt;
	if (!nextDate) {
		return null;
	}
	return encodeCursor({ updatedAtISO: nextDate.toISOString(), id: over.id });
}

function buildPreviewMap(lastMessages: MessageSelect[]) {
	const map = new Map<string, MessageSelect>();
	for (const m of lastMessages) {
		if (!map.has(m.conversationId)) {
			map.set(m.conversationId, m);
		}
	}
	return map;
}

function extractStringFromContent(content: unknown): string | null {
	if (typeof content === "string") {
		return content;
	}
	if (content && typeof content === "object") {
		const anyContent = content as Record<string, unknown>;
		const candidates = [
			anyContent.text,
			anyContent.message,
			anyContent.content,
		];
		for (const value of candidates) {
			if (typeof value === "string") {
				return value;
			}
		}
		try {
			return JSON.stringify(content);
		} catch {
			return null;
		}
	}
	return null;
}

function truncate(text: string, max = 200): string {
	return text.length > max ? `${text.slice(0, max)}…` : text;
}

function toPreview(content: unknown): string | null {
	const str = extractStringFromContent(content);
	return str ? truncate(str) : null;
}

export async function getConversationsByWebsite(
	db: Database,
	params: GetConversationsParams
): Promise<{ items: ConversationListItem[]; nextCursor: string | null }> {
	const limit = Math.max(1, Math.min(100, params.limit ?? 20));

	const decoded = params.cursor ? decodeCursor(params.cursor) : null;
	const cursorDate = decoded ? new Date(decoded.updatedAtISO) : null;
	const cursorId = decoded?.id ?? null;

	const conversationsPage = await db
		.select()
		.from(conversation)
		.where(
			and(
				eq(conversation.websiteId, params.websiteId),
				isNull(conversation.deletedAt),
				buildCursorWhereClause(decoded, cursorDate, cursorId)
			)
		)
		.orderBy(desc(conversation.updatedAt), desc(conversation.id))
		.limit(limit + 1);

	const nextCursor: string | null =
		conversationsPage.length > limit
			? computeNextCursor(conversationsPage)
			: null;

	const items = conversationsPage;
	if (items.length === 0) {
		return { items: [], nextCursor };
	}

	const conversationIds = items.map((c) => c.id);
	const lastMessages = await db
		.select()
		.from(message)
		.where(inArray(message.conversationId, conversationIds))
		.orderBy(desc(message.createdAt));

	const previewMap = buildPreviewMap(lastMessages);
	const itemsWithPreview: ConversationListItem[] = items.map((c) => {
		const last = previewMap.get(c.id) ?? null;
		return {
			...c,
			lastMessagePreview: last ? toPreview(last.content) : null,
		};
	});

	return { items: itemsWithPreview, nextCursor };
}
