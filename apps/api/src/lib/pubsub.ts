import { env } from "@api/env";
import type {
	RealtimeEvent,
	RealtimeEventData,
	RealtimeEventType,
} from "@cossistant/types/realtime-events";
import { Redis } from "@upstash/redis";

// Production-ready constants and interfaces
const MAX_RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_DELAY_MS = 1000;
const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * Subscription state tracking
 */
interface SubscriptionState {
	id: string;
	channels: string[];
	eventHandler: (
		event: RealtimeEvent<RealtimeEventType>,
		channel: string
	) => Promise<void> | void;
	abortController: AbortController;
	reconnectAttempts: number;
	lastHeartbeat: number;
	isActive: boolean;
}

/**
 * Connection pool entry
 */
interface ConnectionEntry {
	id: string;
	subscription?: SubscriptionState;
	lastUsed: number;
	isActive: boolean;
}

/**
 * Metrics tracking
 */
interface PubSubMetrics {
	publishCount: number;
	subscribeCount: number;
	errorCount: number;
	reconnectCount: number;
	activeConnections: number;
	lastActivity: number;
}

/**
 * Redis client for pub/sub operations
 */
const redis = new Redis({
	url: env.UPSTASH_REDIS_REST_URL,
	token: env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Channel prefix for pub/sub events
 */
const CHANNEL_PREFIX = "cossistant:events";

/**
 * Generate channel name for visitor-specific events (conversation-based)
 * Visitors subscribe to events about their specific conversations
 */
function getVisitorChannelName(conversationId: string): string {
	return `${CHANNEL_PREFIX}:visitor:conversation:${conversationId}`;
}

/**
 * Generate channel name for dashboard/agent events (website-based)
 * Agents subscribe to all events happening on their website
 */
function getDashboardChannelName(websiteId: string): string {
	return `${CHANNEL_PREFIX}:dashboard:website:${websiteId}`;
}

/**
 * Generate channel name for connection-specific events
 * For direct messaging to specific WebSocket connections
 */
function getConnectionChannelName(connectionId: string): string {
	return `${CHANNEL_PREFIX}:connection:${connectionId}`;
}

/**
 * Publish target options
 */
export interface PublishTarget {
	/** Target visitors of a specific conversation */
	conversationId?: string;
	/** Target dashboard/agents of a specific website */
	websiteId?: string;
	/** Target specific WebSocket connection directly */
	connectionId?: string;
}

/**
 * Subscribe options for different audience types
 */
export interface SubscribeOptions {
	/** Subscribe to visitor events for a specific conversation */
	conversationId?: string;
	/** Subscribe to dashboard events for a specific website */
	websiteId?: string;
	/** Subscribe to events for a specific connection */
	connectionId?: string;
}

/**
 * Event handler type for subscriptions
 */
export type EventHandler<T extends RealtimeEventType = RealtimeEventType> = (
	event: RealtimeEvent<T>,
	channel: string
) => Promise<void> | void;

/**
 * Subscription interface for managing active subscriptions
 */
export interface Subscription {
	unsubscribe: () => Promise<void>;
}

/**
 * Production-ready typed pub/sub system for realtime events
 * Uses Upstash Redis REST API with Server-Sent Events (SSE) for subscriptions
 */
export class PubSubService {
	private redis: Redis;
	private subscriptions = new Map<string, SubscriptionState>();
	private connectionPool = new Map<string, ConnectionEntry>();
	private metrics: PubSubMetrics;
	private isShuttingDown = false;
	private cleanupInterval?: NodeJS.Timeout;

	constructor() {
		this.redis = redis;
		this.metrics = {
			publishCount: 0,
			subscribeCount: 0,
			errorCount: 0,
			reconnectCount: 0,
			activeConnections: 0,
			lastActivity: Date.now(),
		};

		// Start cleanup interval
		this.cleanupInterval = setInterval(() => {
			this.cleanupInactiveConnections();
		}, 60_000); // Clean up every minute
	}

	/**
	 * Publish an event to the appropriate channels based on target
	 * Includes retry logic and error handling
	 */
	async publish<T extends RealtimeEventType>(
		eventType: T,
		data: RealtimeEventData<T>,
		target: PublishTarget
	): Promise<void> {
		if (this.isShuttingDown) {
			throw new Error("PubSub service is shutting down");
		}

		const event: RealtimeEvent<T> = {
			type: eventType,
			data,
			timestamp: Date.now(),
		};

		const eventPayload = JSON.stringify(event);
		const publishPromises: Array<{
			promise: Promise<number>;
			channel: string;
		}> = [];
		const channels: string[] = [];

		try {
			// Publish to visitor channel (conversation-specific)
			if (target.conversationId) {
				const visitorChannel = getVisitorChannelName(target.conversationId);
				channels.push(visitorChannel);
				publishPromises.push({
					promise: this.publishWithRetry(visitorChannel, eventPayload),
					channel: visitorChannel,
				});
			}

			// Publish to dashboard channel (website-specific)
			if (target.websiteId) {
				const dashboardChannel = getDashboardChannelName(target.websiteId);
				channels.push(dashboardChannel);
				publishPromises.push({
					promise: this.publishWithRetry(dashboardChannel, eventPayload),
					channel: dashboardChannel,
				});
			}

			// Publish to connection-specific channel (direct messaging)
			if (target.connectionId) {
				const connChannel = getConnectionChannelName(target.connectionId);
				channels.push(connChannel);
				publishPromises.push({
					promise: this.publishWithRetry(connChannel, eventPayload),
					channel: connChannel,
				});
			}

			if (publishPromises.length === 0) {
				throw new Error(
					"At least one target must be specified (conversationId, websiteId, or connectionId)"
				);
			}

			// Wait for all publications to complete
			const results = await Promise.allSettled(
				publishPromises.map((p) => p.promise)
			);

			let totalSubscribers = 0;
			let errorCount = 0;

			results.forEach((result, index) => {
				if (result.status === "fulfilled") {
					totalSubscribers += result.value;
				} else {
					errorCount++;
					const channel = publishPromises[index].channel;
					this.logError(
						`Failed to publish to channel ${channel}`,
						result.reason
					);
				}
			});

			// Update metrics
			this.metrics.publishCount++;
			this.metrics.errorCount += errorCount;
			this.metrics.lastActivity = Date.now();

			this.logInfo(
				`Published ${eventType} to ${channels.length} channels (${totalSubscribers} subscribers, ${errorCount} errors)`,
				{
					eventType,
					channels,
					target,
					timestamp: event.timestamp,
					totalSubscribers,
					errorCount,
				}
			);
		} catch (error) {
			this.metrics.errorCount++;
			this.logError("Failed to publish event", error as Error, {
				eventType,
				target,
			});
			throw error;
		}
	}

	/**
	 * Publish with retry logic
	 */
	private async publishWithRetry(
		channel: string,
		message: string,
		attempt = 1
	): Promise<number> {
		try {
			return await this.redis.publish(channel, message);
		} catch (error) {
			if (attempt < 3) {
				const delay = Math.min(1000 * 2 ** (attempt - 1), 5000);
				await new Promise((resolve) => setTimeout(resolve, delay));
				return this.publishWithRetry(channel, message, attempt + 1);
			}
			throw error;
		}
	}

	/**
	 * Subscribe to events using Server-Sent Events (SSE)
	 * Production-ready implementation with reconnection and error handling
	 */
	async subscribe<T extends RealtimeEventType>(
		handler: EventHandler<T>,
		options: SubscribeOptions,
		eventType?: T
	): Promise<Subscription> {
		if (this.isShuttingDown) {
			throw new Error("PubSub service is shutting down");
		}

		const channels: string[] = [];
		const abortController = new AbortController();
		const subscriptionId = `${eventType ?? "ALL"}-${Date.now()}-${Math.random()}`;

		// Determine channels to subscribe to
		if (options.conversationId) {
			channels.push(getVisitorChannelName(options.conversationId));
		}
		if (options.websiteId) {
			channels.push(getDashboardChannelName(options.websiteId));
		}
		if (options.connectionId) {
			channels.push(getConnectionChannelName(options.connectionId));
		}

		if (channels.length === 0) {
			throw new Error(
				"At least one subscription option must be provided (conversationId, websiteId, or connectionId)"
			);
		}

		// Create subscription state
		const subscription: SubscriptionState = {
			id: subscriptionId,
			channels,
			eventHandler: handler as (
				event: RealtimeEvent<RealtimeEventType>,
				channel: string
			) => Promise<void> | void,
			abortController,
			reconnectAttempts: 0,
			lastHeartbeat: Date.now(),
			isActive: true,
		};

		this.subscriptions.set(subscriptionId, subscription);
		this.metrics.subscribeCount++;
		this.metrics.activeConnections++;

		// Start subscription for each channel
		for (const channel of channels) {
			this.startChannelSubscription(subscription, channel);
		}

		this.logInfo(
			`Subscribed to ${eventType ?? "ALL"} on channels: ${channels.join(", ")}`,
			{
				subscriptionId,
				eventType: eventType ?? "ALL",
				channels,
				options,
			}
		);

		return {
			unsubscribe: async () => {
				await this.unsubscribe(subscriptionId);
			},
		};
	}

	/**
	 * Start SSE subscription for a single channel
	 */
	private async startChannelSubscription(
		subscription: SubscriptionState,
		channel: string
	): Promise<void> {
		this.connectToChannel(subscription, channel);
	}

	/**
	 * Connect to a channel with SSE
	 */
	private async connectToChannel(
		subscription: SubscriptionState,
		channel: string
	): Promise<void> {
		if (!this.shouldConnect(subscription)) {
			return;
		}

		try {
			const response = await this.createSSEConnection(channel, subscription);
			await this.handleSSEStream(response, subscription, channel);
		} catch (error) {
			await this.handleConnectionError(error, subscription, channel);
		}
	}

	/**
	 * Check if connection should be established
	 */
	private shouldConnect(subscription: SubscriptionState): boolean {
		return (
			subscription.isActive && !subscription.abortController.signal.aborted
		);
	}

	/**
	 * Create SSE connection to channel
	 */
	private async createSSEConnection(
		channel: string,
		subscription: SubscriptionState
	): Promise<Response> {
		const response = await fetch(
			`${env.UPSTASH_REDIS_REST_URL}/subscribe/${encodeURIComponent(channel)}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
					Accept: "text/event-stream",
					"Cache-Control": "no-cache",
				},
				signal: subscription.abortController.signal,
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		if (!response.body) {
			throw new Error("No response body received");
		}

		return response;
	}

	/**
	 * Handle SSE stream processing
	 */
	private async handleSSEStream(
		response: Response,
		subscription: SubscriptionState,
		channel: string
	): Promise<void> {
		if (!response.body) {
			throw new Error("Response body is null");
		}
		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		subscription.reconnectAttempts = 0;
		subscription.lastHeartbeat = Date.now();

		try {
			await this.processStreamChunks(reader, decoder, subscription, channel);
		} finally {
			reader.releaseLock();
		}
	}

	/**
	 * Process stream chunks without await in loop
	 */
	private async processStreamChunks(
		reader: ReadableStreamDefaultReader<Uint8Array>,
		decoder: TextDecoder,
		subscription: SubscriptionState,
		channel: string
	): Promise<void> {
		let buffer = "";

		while (this.shouldConnect(subscription)) {
			// biome-ignore lint: Stream processing requires sequential reads
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");

			// Keep the last incomplete line in buffer
			buffer = lines.pop() || "";

			// Process complete lines in parallel
			const messagePromises = lines
				.filter((line) => line.startsWith("data: "))
				.map((line) => {
					const data = line.slice(6);
					return this.processSSEMessage(subscription, channel, data);
				});

			// Wait for all messages to be processed
			await Promise.all(messagePromises);
		}
	}

	/**
	 * Handle connection errors and reconnection
	 */
	private async handleConnectionError(
		error: unknown,
		subscription: SubscriptionState,
		channel: string
	): Promise<void> {
		if (subscription.abortController.signal.aborted) {
			return; // Expected when unsubscribing
		}

		this.metrics.errorCount++;
		this.logError(
			`SSE connection failed for channel ${channel}`,
			error as Error
		);

		if (subscription.reconnectAttempts >= MAX_RECONNECTION_ATTEMPTS) {
			this.logError(`Max reconnection attempts reached for channel ${channel}`);
			subscription.isActive = false;
			return;
		}

		await this.scheduleReconnection(subscription, channel);
	}

	/**
	 * Schedule reconnection with exponential backoff
	 */
	private async scheduleReconnection(
		subscription: SubscriptionState,
		channel: string
	): Promise<void> {
		subscription.reconnectAttempts++;
		this.metrics.reconnectCount++;

		const delay = Math.min(
			RECONNECTION_DELAY_MS * 2 ** (subscription.reconnectAttempts - 1),
			30_000
		);

		this.logInfo(
			`Reconnecting to ${channel} in ${delay}ms (attempt ${subscription.reconnectAttempts})`
		);

		setTimeout(() => {
			this.connectToChannel(subscription, channel);
		}, delay);
	}

	/**
	 * Process incoming SSE message
	 */
	private async processSSEMessage(
		subscription: SubscriptionState,
		channel: string,
		data: string
	): Promise<void> {
		try {
			// Parse SSE message format: "type,channel,message"
			const parts = data.split(",", 3);
			if (parts.length < 2) {
				return; // Invalid message format
			}

			const [messageType, messageChannel] = parts;
			const message = parts.length > 2 ? parts.slice(2).join(",") : "";

			subscription.lastHeartbeat = Date.now();

			if (messageType === "subscribe") {
				// Subscription confirmation
				this.logInfo(`Subscription confirmed for channel ${channel}`);
				return;
			}

			if (messageType === "message" && messageChannel === channel && message) {
				try {
					// Parse the event message
					const event = JSON.parse(message) as RealtimeEvent<RealtimeEventType>;

					// Call the handler
					await subscription.eventHandler(event, channel);

					this.metrics.lastActivity = Date.now();
				} catch (parseError) {
					this.logError(
						`Failed to parse message from channel ${channel}`,
						parseError as Error,
						{ message }
					);
				}
			}
		} catch (error) {
			this.logError(
				`Failed to process SSE message from channel ${channel}`,
				error as Error,
				{ data }
			);
		}
	}

	/**
	 * Unsubscribe from a subscription
	 */
	private async unsubscribe(subscriptionId: string): Promise<void> {
		const subscription = this.subscriptions.get(subscriptionId);
		if (!subscription) {
			return;
		}

		subscription.isActive = false;
		subscription.abortController.abort();
		this.subscriptions.delete(subscriptionId);
		this.metrics.activeConnections--;

		this.logInfo(`Unsubscribed from subscription ${subscriptionId}`);
	}

	/**
	 * Get metrics for monitoring
	 */
	getMetrics(): Readonly<PubSubMetrics> {
		return { ...this.metrics };
	}

	/**
	 * Get active subscription count
	 */
	getActiveSubscriptionCount(): number {
		return Array.from(this.subscriptions.values()).filter((s) => s.isActive)
			.length;
	}

	/**
	 * Health check for the pub/sub service
	 */
	async healthCheck(): Promise<{
		healthy: boolean;
		details: Record<string, unknown>;
	}> {
		const now = Date.now();
		const activeSubscriptions = this.getActiveSubscriptionCount();
		const stalledConnections = Array.from(this.subscriptions.values()).filter(
			(s) => s.isActive && now - s.lastHeartbeat > HEARTBEAT_INTERVAL_MS * 2
		).length;

		const healthy =
			!this.isShuttingDown && stalledConnections < activeSubscriptions * 0.5;

		return {
			healthy,
			details: {
				isShuttingDown: this.isShuttingDown,
				activeSubscriptions,
				stalledConnections,
				metrics: this.metrics,
				uptime: now - this.metrics.lastActivity,
			},
		};
	}

	/**
	 * Clean up inactive connections
	 */
	private cleanupInactiveConnections(): void {
		const now = Date.now();
		const toRemove: string[] = [];

		for (const [id, subscription] of this.subscriptions.entries()) {
			// Remove subscriptions that have been inactive for too long
			if (
				!subscription.isActive ||
				now - subscription.lastHeartbeat > HEARTBEAT_INTERVAL_MS * 3
			) {
				subscription.isActive = false;
				subscription.abortController.abort();
				toRemove.push(id);
			}
		}

		for (const id of toRemove) {
			this.subscriptions.delete(id);
			this.metrics.activeConnections--;
		}

		if (toRemove.length > 0) {
			this.logInfo(`Cleaned up ${toRemove.length} inactive connections`);
		}
	}

	/**
	 * Graceful shutdown with proper cleanup
	 */
	async shutdown(): Promise<void> {
		this.logInfo("Initiating graceful shutdown...");
		this.isShuttingDown = true;

		// Clear cleanup interval
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = undefined;
		}

		// Close all active subscriptions
		const shutdownPromises: Promise<void>[] = [];

		for (const subscription of this.subscriptions.values()) {
			subscription.isActive = false;
			subscription.abortController.abort();
		}

		// Wait for all subscriptions to close (with timeout)
		try {
			await Promise.race([
				Promise.all(shutdownPromises),
				new Promise((_, reject) =>
					setTimeout(() => reject(new Error("Shutdown timeout")), 10_000)
				),
			]);
		} catch (error) {
			this.logError("Error during shutdown", error as Error);
		}

		this.subscriptions.clear();
		this.connectionPool.clear();
		this.metrics.activeConnections = 0;

		this.logInfo("PubSub service shutdown complete", {
			finalMetrics: this.metrics,
		});
	}

	/**
	 * Structured logging methods
	 */
	private logInfo(message: string, data?: Record<string, unknown>): void {
		const logEntry = {
			level: "info",
			service: "pubsub",
			message,
			timestamp: new Date().toISOString(),
			...data,
		};

		if (process.env.NODE_ENV === "development") {
			console.log(`[PubSub] ${message}`, data || "");
		} else {
			console.log(JSON.stringify(logEntry));
		}
	}

	private logError(
		message: string,
		error?: Error,
		data?: Record<string, unknown>
	): void {
		const logEntry = {
			level: "error",
			service: "pubsub",
			message,
			error: error
				? {
						name: error.name,
						message: error.message,
						stack: error.stack,
					}
				: undefined,
			timestamp: new Date().toISOString(),
			...data,
		};

		if (process.env.NODE_ENV === "development") {
			console.error(`[PubSub] ${message}`, error || "", data || "");
		} else {
			console.error(JSON.stringify(logEntry));
		}
	}
}

/**
 * Global pub/sub service instance
 */
export const pubsub = new PubSubService();

/**
 * Convenience functions for common pub/sub operations
 */

/**
 * Emit an event to visitors of a specific conversation
 */
export async function emitToVisitors<T extends RealtimeEventType>(
	conversationId: string,
	eventType: T,
	data: RealtimeEventData<T>
): Promise<void> {
	return pubsub.publish(eventType, data, { conversationId });
}

/**
 * Emit an event to dashboard/agents of a specific website
 */
export async function emitToDashboard<T extends RealtimeEventType>(
	websiteId: string,
	eventType: T,
	data: RealtimeEventData<T>
): Promise<void> {
	return pubsub.publish(eventType, data, { websiteId });
}

/**
 * Emit an event to both visitors and dashboard
 * This is useful for events that should be seen by both audiences
 */
export async function emitToAll<T extends RealtimeEventType>(
	conversationId: string,
	websiteId: string,
	eventType: T,
	data: RealtimeEventData<T>
): Promise<void> {
	return pubsub.publish(eventType, data, { conversationId, websiteId });
}

/**
 * Emit an event to a specific WebSocket connection
 */
export async function emitToConnection<T extends RealtimeEventType>(
	connectionId: string,
	eventType: T,
	data: RealtimeEventData<T>
): Promise<void> {
	return pubsub.publish(eventType, data, { connectionId });
}

/**
 * Helper function to trigger events from anywhere in the API
 * This is the main function that should be used throughout the codebase
 */
export async function triggerEvent<T extends RealtimeEventType>(
	eventType: T,
	data: RealtimeEventData<T>,
	target: PublishTarget
): Promise<void> {
	return pubsub.publish(eventType, data, target);
}
