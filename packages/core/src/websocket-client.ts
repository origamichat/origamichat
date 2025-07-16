import {
	type ConversationUpdatedEvent,
	CossistantAPIError,
	type CossistantConfig,
	type CossistantWebSocketEvent,
	type EventHandlers,
	type MessageReceivedEvent,
	type TypingEvent,
} from "./types";

export class CossistantWebSocketClient {
	private config: CossistantConfig;
	private ws: WebSocket | null = null;
	private eventHandlers: EventHandlers = {};
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;
	private isConnecting = false;
	private isManuallyDisconnected = false;

	constructor(config: CossistantConfig) {
		this.config = config;
	}

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.ws?.readyState === WebSocket.OPEN) {
				resolve();
				return;
			}

			if (this.isConnecting) {
				return;
			}

			this.isConnecting = true;
			this.isManuallyDisconnected = false;

			try {
				const url = this.buildWebSocketUrl();
				this.ws = new WebSocket(url);

				this.ws.onopen = () => {
					this.isConnecting = false;
					this.reconnectAttempts = 0;
					this.eventHandlers.onConnect?.();
					resolve();
				};

				this.ws.onmessage = (event) => {
					try {
						const data = JSON.parse(event.data);
						this.handleWebSocketEvent(data);
					} catch (error) {
						console.error("Failed to parse WebSocket message:", error);
						this.eventHandlers.onError?.({
							code: "WEBSOCKET_PARSE_ERROR",
							message: "Failed to parse WebSocket message",
							details: { error, rawData: event.data },
						});
					}
				};

				this.ws.onclose = (event) => {
					this.isConnecting = false;
					this.ws = null;
					this.eventHandlers.onDisconnect?.();

					if (!this.isManuallyDisconnected && this.shouldReconnect()) {
						this.scheduleReconnect();
					}
				};

				this.ws.onerror = (error) => {
					this.isConnecting = false;
					this.eventHandlers.onError?.({
						code: "WEBSOCKET_ERROR",
						message: "WebSocket connection error",
						details: { error },
					});
					reject(
						new CossistantAPIError({
							code: "WEBSOCKET_ERROR",
							message: "Failed to connect to WebSocket",
							details: { error },
						})
					);
				};
			} catch (error) {
				this.isConnecting = false;
				reject(
					new CossistantAPIError({
						code: "WEBSOCKET_INIT_ERROR",
						message: "Failed to initialize WebSocket connection",
						details: { error },
					})
				);
			}
		});
	}

	disconnect(): void {
		this.isManuallyDisconnected = true;
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}

	send(data: unknown): void {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data));
		} else {
			throw new CossistantAPIError({
				code: "WEBSOCKET_NOT_CONNECTED",
				message: "WebSocket is not connected",
			});
		}
	}

	on<T extends keyof EventHandlers>(event: T, handler: EventHandlers[T]): void {
		this.eventHandlers[event] = handler;
	}

	off<T extends keyof EventHandlers>(event: T): void {
		delete this.eventHandlers[event];
	}

	isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	private buildWebSocketUrl(): string {
		const url = new URL(this.config.wsUrl);

		// Add public key if available
		if (this.config.publicKey) {
			url.searchParams.set("publicKey", this.config.publicKey);
		}

		// Add API key if available (for backward compatibility)
		if (this.config.apiKey) {
			url.searchParams.set("token", this.config.apiKey);
		}

		if (this.config.userId) {
			url.searchParams.set("userId", this.config.userId);
		}

		if (this.config.organizationId) {
			url.searchParams.set("organizationId", this.config.organizationId);
		}

		return url.toString();
	}

	private handleWebSocketEvent(data: unknown): void {
		const event = data as CossistantWebSocketEvent;

		switch (event.type) {
			case "message_received":
				this.eventHandlers.onMessage?.(event as MessageReceivedEvent);
				break;
			case "conversation_updated":
				this.eventHandlers.onConversationUpdate?.(
					event as ConversationUpdatedEvent
				);
				break;
			case "typing":
				this.eventHandlers.onTyping?.(event as TypingEvent);
				break;
			default:
				console.warn("Unknown WebSocket event type", event);
		}
	}

	private shouldReconnect(): boolean {
		return this.reconnectAttempts < this.maxReconnectAttempts;
	}

	private scheduleReconnect(): void {
		setTimeout(
			() => {
				this.reconnectAttempts++;
				this.connect().catch((error) => {
					console.error("Reconnection failed:", error);
					if (this.shouldReconnect()) {
						this.scheduleReconnect();
					}
				});
			},
			this.reconnectDelay * 2 ** this.reconnectAttempts
		);
	}

	updateConfiguration(config: Partial<CossistantConfig>): void {
		const wasConnected = this.isConnected();

		if (wasConnected) {
			this.disconnect();
		}

		this.config = { ...this.config, ...config };

		if (wasConnected) {
			this.connect();
		}
	}
}
