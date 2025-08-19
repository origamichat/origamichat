import type {
	CreateConversationRequestBody,
	CreateConversationResponseBody,
	ListConversationsRequest,
	ListConversationsResponse,
	GetConversationRequest,
	GetConversationResponse,
} from "@cossistant/types/api/conversation";
import type { RealtimeEvent } from "@cossistant/types/realtime-events";
import { CossistantRestClient } from "./rest-client";
import type { CossistantConfig, PublicWebsiteResponse } from "./types";
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

	// Website information
	async getWebsite(): Promise<PublicWebsiteResponse> {
		return this.restClient.getWebsite();
	}

	setWebsiteContext(websiteId: string, visitorId?: string): void {
		this.restClient.setWebsiteContext(websiteId, visitorId);
	}

	// Conversation management
	async createConversation(
		params?: Partial<CreateConversationRequestBody>
	): Promise<CreateConversationResponseBody> {
		return this.restClient.createConversation(params);
	}

	async listConversations(
		params?: Partial<ListConversationsRequest>
	): Promise<ListConversationsResponse> {
		return this.restClient.listConversations(params);
	}

	async getConversation(
		params: GetConversationRequest
	): Promise<GetConversationResponse> {
		return this.restClient.getConversation(params);
	}

	// Cleanup method
	destroy(): void {
		this.disconnectWebSocket();
	}
}
