import { CossistantRestClient } from "./rest-client";
import {
	type Conversation,
	CossistantAPIError,
	type CossistantConfig,
	type EventHandlers,
	type GetConversationsResponse,
	type GetMessagesResponse,
	Message,
	type SendMessageRequest,
	type SendMessageResponse,
} from "./types";
import { CossistantWebSocketClient } from "./websocket-client";

export class CossistantClient {
	private restClient: CossistantRestClient;
	private wsClient: CossistantWebSocketClient;
	private config: CossistantConfig;

	constructor(config: CossistantConfig) {
		this.config = config;
		this.restClient = new CossistantRestClient(config);
		this.wsClient = new CossistantWebSocketClient(config);
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

	sendWebSocketMessage(data: unknown): void {
		this.wsClient.send(data);
	}

	// Event handling
	on<T extends keyof EventHandlers>(event: T, handler: EventHandlers[T]): void {
		this.wsClient.on(event, handler);
	}

	off<T extends keyof EventHandlers>(event: T): void {
		this.wsClient.off(event);
	}

	// Configuration updates
	updateConfiguration(config: Partial<CossistantConfig>): void {
		this.config = { ...this.config, ...config };
		this.restClient.updateConfiguration(config);
		this.wsClient.updateConfiguration(config);
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

	// Cleanup method
	destroy(): void {
		this.disconnectWebSocket();
	}
}
