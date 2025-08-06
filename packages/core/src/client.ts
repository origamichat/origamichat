import type { RealtimeEvent } from "@cossistant/types/realtime-events";
import { CossistantRestClient } from "./rest-client";
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
import {
	CossistantWebSocketClient,
	type CossistantWebSocketConfig,
	type WebSocketEventHandlers,
} from "./websocket-client";

export class CossistantClient {
	private restClient: CossistantRestClient;
	private wsClient: CossistantWebSocketClient;
	private config: CossistantConfig;

	constructor(config: CossistantConfig) {
		this.config = config;
		this.restClient = new CossistantRestClient(config);
		const wsConfig: CossistantWebSocketConfig = {
			wsUrl: config.wsUrl,
			publicKey: config.publicKey,
			apiKey: config.apiKey,
			userId: config.userId,
			organizationId: config.organizationId,
		};
		this.wsClient = new CossistantWebSocketClient(wsConfig);
	}

	// REST API methods
	async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
		return this.restClient.sendMessage(request);
	}

	async getConversations(
		page?: number,
		limit?: number
	): Promise<GetConversationsResponse> {
		return this.restClient.getConversations(page, limit);
	}

	async getConversation(conversationId: string): Promise<Conversation> {
		return this.restClient.getConversation(conversationId);
	}

	async getMessages(
		conversationId: string,
		page?: number,
		limit?: number
	): Promise<GetMessagesResponse> {
		return this.restClient.getMessages(conversationId, page, limit);
	}

	async markAsRead(conversationId: string): Promise<void> {
		return this.restClient.markAsRead(conversationId);
	}

	async archiveConversation(conversationId: string): Promise<void> {
		return this.restClient.archiveConversation(conversationId);
	}

	async deleteConversation(conversationId: string): Promise<void> {
		return this.restClient.deleteConversation(conversationId);
	}

	// WebSocket methods
	async connectWebSocket(): Promise<void> {
		return this.wsClient.connect();
	}

	disconnectWebSocket(): void {
		this.wsClient.disconnect();
	}

	isWebSocketConnected(): boolean {
		return this.wsClient.isConnected();
	}

	sendWebSocketMessage(event: RealtimeEvent): void {
		this.wsClient.send(event);
	}

	// Event handling
	on<T extends keyof WebSocketEventHandlers>(
		event: T,
		handler: WebSocketEventHandlers[T]
	): void {
		this.wsClient.on(event, handler);
	}

	off<T extends keyof WebSocketEventHandlers>(event: T): void {
		this.wsClient.off(event);
	}

	// Configuration updates
	updateConfiguration(config: Partial<CossistantConfig>): void {
		this.config = { ...this.config, ...config };
		this.restClient.updateConfiguration(config);

		const wsConfig: Partial<CossistantWebSocketConfig> = {};

		if (config.wsUrl !== undefined) {
			wsConfig.wsUrl = config.wsUrl;
		}
		if (config.publicKey !== undefined) {
			wsConfig.publicKey = config.publicKey;
		}
		if (config.apiKey !== undefined) {
			wsConfig.apiKey = config.apiKey;
		}
		if (config.userId !== undefined) {
			wsConfig.userId = config.userId;
		}
		if (config.organizationId !== undefined) {
			wsConfig.organizationId = config.organizationId;
		}

		this.wsClient.updateConfiguration(wsConfig);
	}

	// Utility methods
	getConfiguration(): CossistantConfig {
		return { ...this.config };
	}

	// Helper method to send a message and automatically connect to WebSocket if needed
	async sendMessageWithRealtime(
		request: SendMessageRequest
	): Promise<SendMessageResponse> {
		// Ensure WebSocket is connected for real-time updates
		if (!this.isWebSocketConnected()) {
			try {
				await this.connectWebSocket();
			} catch (error) {
				console.warn(
					"Failed to connect WebSocket, continuing with REST only:",
					error
				);
			}
		}

		return this.sendMessage(request);
	}

	// Helper method to get conversations with real-time updates
	async getConversationsWithRealtime(
		page?: number,
		limit?: number
	): Promise<GetConversationsResponse> {
		// Ensure WebSocket is connected for real-time updates
		if (!this.isWebSocketConnected()) {
			try {
				await this.connectWebSocket();
			} catch (error) {
				console.warn(
					"Failed to connect WebSocket, continuing with REST only:",
					error
				);
			}
		}

		return this.getConversations(page, limit);
	}

	// Website information
	async getWebsite(): Promise<PublicWebsiteResponse> {
		return this.restClient.getWebsite();
	}

	// Cleanup method
	destroy(): void {
		this.disconnectWebSocket();
	}
}
