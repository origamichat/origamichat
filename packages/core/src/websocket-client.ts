import type {
	RealtimeEvent,
	RealtimeEventType,
} from "@cossistant/types/realtime-events";
import { CossistantAPIError } from "./types";

export interface CossistantWebSocketConfig {
	wsUrl: string;
	publicKey?: string;
	apiKey?: string;
	userId?: string;
	organizationId?: string;
}

export interface WebSocketEventHandlers {
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: CossistantAPIError) => void;
	onEvent?: (event: RealtimeEvent) => void;
}

export class CossistantWebSocketClient {
	private config: CossistantWebSocketConfig;
	private ws: WebSocket | null = null;
	private eventHandlers: WebSocketEventHandlers = {};
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectDelay = 1000;
	private isConnecting = false;
	private isManuallyDisconnected = false;

	constructor(config: CossistantWebSocketConfig) {
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
						const data = JSON.parse(event.data) as RealtimeEvent;
						this.eventHandlers.onEvent?.(data);
					} catch (error) {
						console.error("Failed to parse WebSocket message:", error);
						const apiError = new CossistantAPIError({
							code: "WEBSOCKET_PARSE_ERROR",
							message: "Failed to parse WebSocket message",
							details: { error, rawData: event.data },
						});
						this.eventHandlers.onError?.(apiError);
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
					const apiError = new CossistantAPIError({
						code: "WEBSOCKET_ERROR",
						message: "WebSocket connection error",
						details: { error },
					});
					this.eventHandlers.onError?.(apiError);
					reject(apiError);
				};
			} catch (error) {
				this.isConnecting = false;
				const apiError = new CossistantAPIError({
					code: "WEBSOCKET_INIT_ERROR",
					message: "Failed to initialize WebSocket connection",
					details: { error },
				});
				reject(apiError);
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

	send<T extends RealtimeEventType>(event: RealtimeEvent<T>): void {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(event));
		} else {
			throw new CossistantAPIError({
				code: "WEBSOCKET_NOT_CONNECTED",
				message: "WebSocket is not connected",
			});
		}
	}

	on<T extends keyof WebSocketEventHandlers>(
		event: T,
		handler: WebSocketEventHandlers[T]
	): void {
		this.eventHandlers[event] = handler;
	}

	off<T extends keyof WebSocketEventHandlers>(event: T): void {
		delete this.eventHandlers[event];
	}

	isConnected(): boolean {
		return this.ws?.readyState === WebSocket.OPEN;
	}

	private buildWebSocketUrl(): string {
		const url = new URL(this.config.wsUrl);

		if (this.config.publicKey) {
			url.searchParams.set("publicKey", this.config.publicKey);
		}

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

	updateConfiguration(config: Partial<CossistantWebSocketConfig>): void {
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
