import {
	type Conversation,
	CossistantAPIError,
	type CossistantConfig,
	type GetConversationsResponse,
	type GetMessagesResponse,
	Message,
	type PublicWebsiteResponse,
	type SendMessageRequest,
	type SendMessageResponse,
} from "./types";
import { getVisitorId, setVisitorId } from "./visitor-tracker";

export class CossistantRestClient {
	private config: CossistantConfig;
	private baseHeaders: Record<string, string>;
	private publicKey: string;
	private websiteId: string | null = null;

	constructor(config: CossistantConfig) {
		this.config = config;

		// Get public key from config or environment variables
		this.publicKey =
			config.publicKey ||
			(typeof process !== "undefined"
				? process.env.NEXT_PUBLIC_COSSISSTANT_KEY
				: undefined) ||
			(typeof process !== "undefined"
				? process.env.COSSISSTANT_PUBLIC_KEY
				: undefined) ||
			"";

		if (!this.publicKey) {
			throw new Error(
				"Public key is required. Please provide it in the config or set NEXT_PUBLIC_COSSISSTANT_KEY or COSSISSTANT_PUBLIC_KEY environment variable."
			);
		}

		this.baseHeaders = {
			"Content-Type": "application/json",
			"X-Public-Key": this.publicKey,
		};

		if (config.userId) {
			this.baseHeaders["X-User-ID"] = config.userId;
		}

		if (config.organizationId) {
			this.baseHeaders["X-Organization-ID"] = config.organizationId;
		}
	}

	private async request<T>(
		path: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.config.apiUrl}${path}`;

		const response = await fetch(url, {
			...options,
			headers: {
				...this.baseHeaders,
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new CossistantAPIError({
				code: errorData.code || `HTTP_${response.status}`,
				message: errorData.message || response.statusText,
				details: errorData.details,
			});
		}

		return response.json();
	}

	async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
		return this.request<SendMessageResponse>("/messages", {
			method: "POST",
			body: JSON.stringify(request),
		});
	}

	async getConversations(
		page = 1,
		limit = 20
	): Promise<GetConversationsResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		return this.request<GetConversationsResponse>(`/conversations?${params}`);
	}

	async getConversation(conversationId: string): Promise<Conversation> {
		return this.request<Conversation>(`/conversations/${conversationId}`);
	}

	async getMessages(
		conversationId: string,
		page = 1,
		limit = 50
	): Promise<GetMessagesResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		return this.request<GetMessagesResponse>(
			`/conversations/${conversationId}/messages?${params}`
		);
	}

	async markAsRead(conversationId: string): Promise<void> {
		await this.request(`/conversations/${conversationId}/read`, {
			method: "POST",
		});
	}

	async archiveConversation(conversationId: string): Promise<void> {
		await this.request(`/conversations/${conversationId}/archive`, {
			method: "POST",
		});
	}

	async deleteConversation(conversationId: string): Promise<void> {
		await this.request(`/conversations/${conversationId}`, {
			method: "DELETE",
		});
	}

	async getWebsite(): Promise<PublicWebsiteResponse> {
		// Make the request with visitor ID if we have one stored
		const headers: Record<string, string> = {};

		// If we already know the website ID, try to get the visitor ID
		if (this.websiteId) {
			const storedVisitorId = getVisitorId(this.websiteId);
			if (storedVisitorId) {
				headers["X-Visitor-Id"] = storedVisitorId;
			}
		}

		const response = await this.request<PublicWebsiteResponse>("/website", {
			headers,
		});

		// Store the website ID for future requests
		this.websiteId = response.id;

		// Store the visitor ID if we got one
		if (response.visitor?.id) {
			setVisitorId(response.id, response.visitor.id);
		}

		return response;
	}

	async updateConfiguration(config: Partial<CossistantConfig>): Promise<void> {
		if (config.publicKey) {
			this.publicKey = config.publicKey;
			this.baseHeaders["X-Public-Key"] = config.publicKey;
		}

		if (config.userId) {
			this.baseHeaders["X-User-ID"] = config.userId;
		} else if (config.userId === null) {
			const { "X-User-ID": _, ...rest } = this.baseHeaders;
			this.baseHeaders = rest;
		}

		if (config.organizationId) {
			this.baseHeaders["X-Organization-ID"] = config.organizationId;
		} else if (config.organizationId === null) {
			const { "X-Organization-ID": _, ...rest } = this.baseHeaders;
			this.baseHeaders = rest;
		}

		this.config = { ...this.config, ...config };
	}
}
