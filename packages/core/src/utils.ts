import { CossistantClient } from "./client";
import {
	type Conversation,
	CossistantAPIError,
	type Message,
	SenderType,
	type SendMessageRequest,
} from "./types";

export class DataFetcher {
	private client: CossistantClient;
	private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
	private cacheTimeout = 5 * 60 * 1000; // 5 minutes

	constructor(client: CossistantClient) {
		this.client = client;
	}

	private getCacheKey(method: string, params: unknown[]): string {
		return `${method}:${JSON.stringify(params)}`;
	}

	private isExpired(timestamp: number): boolean {
		return Date.now() - timestamp > this.cacheTimeout;
	}

	private setCache(key: string, data: unknown): void {
		this.cache.set(key, { data, timestamp: Date.now() });
	}

	private getCache<T>(key: string): T | null {
		const cached = this.cache.get(key);
		if (cached && !this.isExpired(cached.timestamp)) {
			return cached.data as T;
		}
		this.cache.delete(key);
		return null;
	}

	async fetchConversations(page = 1, limit = 20, useCache = true) {
		const cacheKey = this.getCacheKey("conversations", [page, limit]);

		if (useCache) {
			const cached = this.getCache(cacheKey);

			if (cached) {
				return cached;
			}
		}

		try {
			const result = await this.client.getConversations(page, limit);
			this.setCache(cacheKey, result);
			return result;
		} catch (error) {
			if (error instanceof CossistantAPIError) {
				throw error;
			}
			throw new CossistantAPIError({
				code: "FETCH_CONVERSATIONS_ERROR",
				message: "Failed to fetch conversations",
				details: { error },
			});
		}
	}

	async fetchMessages(
		conversationId: string,
		page = 1,
		limit = 50,
		useCache = true
	) {
		const cacheKey = this.getCacheKey("messages", [
			conversationId,
			page,
			limit,
		]);

		if (useCache) {
			const cached = this.getCache(cacheKey);
			if (cached) {
				return cached;
			}
		}

		try {
			const result = await this.client.getMessages(conversationId, page, limit);
			this.setCache(cacheKey, result);
			return result;
		} catch (error) {
			if (error instanceof CossistantAPIError) {
				throw error;
			}
			throw new CossistantAPIError({
				code: "FETCH_MESSAGES_ERROR",
				message: "Failed to fetch messages",
				details: { error },
			});
		}
	}

	async fetchConversation(conversationId: string, useCache = true) {
		const cacheKey = this.getCacheKey("conversation", [conversationId]);

		if (useCache) {
			const cached = this.getCache(cacheKey);
			if (cached) {
				return cached;
			}
		}

		try {
			const result = await this.client.getConversation(conversationId);
			this.setCache(cacheKey, result);
			return result;
		} catch (error) {
			if (error instanceof CossistantAPIError) {
				throw error;
			}
			throw new CossistantAPIError({
				code: "FETCH_CONVERSATION_ERROR",
				message: "Failed to fetch conversation",
				details: { error },
			});
		}
	}

	async sendMessage(request: SendMessageRequest, useRealtime = true) {
		try {
			const result = useRealtime
				? await this.client.sendMessageWithRealtime(request)
				: await this.client.sendMessage(request);

			// Invalidate relevant caches
			this.invalidateConversationCaches(request.conversationId);

			return result;
		} catch (error) {
			if (error instanceof CossistantAPIError) {
				throw error;
			}
			throw new CossistantAPIError({
				code: "SEND_MESSAGE_ERROR",
				message: "Failed to send message",
				details: { error },
			});
		}
	}

	private invalidateConversationCaches(conversationId?: string): void {
		const keysToDelete: string[] = [];

		for (const [key] of this.cache) {
			if (
				key.startsWith("conversations:") ||
				(conversationId && key.includes(conversationId))
			) {
				keysToDelete.push(key);
			}
		}

		for (const key of keysToDelete) {
			this.cache.delete(key);
		}
	}

	clearCache(): void {
		this.cache.clear();
	}

	setCacheTimeout(timeout: number): void {
		this.cacheTimeout = timeout;
	}
}

// Utility functions for common operations
export function createMessageContent(
	content: string,
	metadata?: Record<string, unknown>
): SendMessageRequest {
	return {
		content,
		metadata,
	};
}

export function createConversationMessage(
	conversationId: string,
	content: string,
	metadata?: Record<string, unknown>
): SendMessageRequest {
	return {
		conversationId,
		content,
		metadata,
	};
}

export function sortMessagesByTimestamp(messages: Message[]): Message[] {
	return [...messages].sort(
		(a, b) => a.timestamp.getTime() - b.timestamp.getTime()
	);
}

export function sortConversationsByUpdatedAt(
	conversations: Conversation[]
): Conversation[] {
	return [...conversations].sort(
		(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
	);
}

export function getTotalUnreadCount(conversations: Conversation[]): number {
	return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
}

export function filterConversationsByStatus(
	conversations: Conversation[],
	status: Conversation["status"]
): Conversation[] {
	return conversations.filter((conv) => conv.status === status);
}

export function isMessageFromUser(message: Message): boolean {
	return message.sender === SenderType.VISITOR;
}

export function isMessageFromAssistant(message: Message): boolean {
	return message.sender === SenderType.AI;
}

export function getLastMessage(messages: Message[]): Message | undefined {
	if (messages.length === 0) {
		return;
	}
	return sortMessagesByTimestamp(messages)[messages.length - 1];
}

export function formatMessageTimestamp(timestamp: Date): string {
	return timestamp.toLocaleString();
}

export function createClientWithDefaults(config: {
	apiUrl: string;
	wsUrl: string;
	apiKey: string;
	userId?: string;
	organizationId?: string;
}): CossistantClient {
	return new CossistantClient(config);
}
