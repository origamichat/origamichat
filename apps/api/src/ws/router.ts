import { emitToDashboard } from "@api/lib/pubsub";
import type {
	RealtimeEvent,
	RealtimeEventData,
	RealtimeEventType,
} from "@cossistant/types/realtime-events";

type EventContext = {
	connectionId: string;
	userId?: string;
	websiteId?: string;
	organizationId?: string;
	ws?: WebSocket;
};

type EventHandler<T extends RealtimeEventType> = (
	ctx: EventContext,
	data: RealtimeEventData<T>
) => Promise<void> | void;

type EventHandlers = {
	[K in RealtimeEventType]: EventHandler<K>;
};

/**
 * Event handlers for each realtime event type
 * Each handler receives context and validated data
 * Handlers now also emit events via pub/sub to reach other connections
 */
const eventHandlers: EventHandlers = {
	USER_CONNECTED: async (ctx, data) => {
		console.log(`[USER_CONNECTED] User ${data.userId} connected`, {
			connectionId: data.connectionId,
			timestamp: new Date(data.timestamp).toISOString(),
			contextConnectionId: ctx.connectionId,
			websiteId: ctx.websiteId,
		});

		// Emit to dashboard so agents can see user connections
		if (ctx.websiteId) {
			await emitToDashboard(ctx.websiteId, "USER_CONNECTED", data);
		}
	},

	USER_DISCONNECTED: async (ctx, data) => {
		console.log(`[USER_DISCONNECTED] User ${data.userId} disconnected`, {
			connectionId: data.connectionId,
			timestamp: new Date(data.timestamp).toISOString(),
			contextConnectionId: ctx.connectionId,
			websiteId: ctx.websiteId,
		});

		// Emit to dashboard so agents can see user disconnections
		if (ctx.websiteId) {
			await emitToDashboard(ctx.websiteId, "USER_DISCONNECTED", data);
		}
	},

	USER_PRESENCE_UPDATE: async (ctx, data) => {
		console.log(
			`[USER_PRESENCE_UPDATE] User ${data.userId} status: ${data.status}`,
			{
				lastSeen: new Date(data.lastSeen).toISOString(),
				contextConnectionId: ctx.connectionId,
				websiteId: ctx.websiteId,
			}
		);

		// Emit to dashboard so agents can see presence updates
		if (ctx.websiteId) {
			await emitToDashboard(ctx.websiteId, "USER_PRESENCE_UPDATE", data);
		}
	},
};

/**
 * Routes an event to its appropriate handler
 */
export async function routeEvent<T extends RealtimeEventType>(
	event: RealtimeEvent<T>,
	context: EventContext
): Promise<void> {
	const handler = eventHandlers[event.type] as EventHandler<T>;

	if (!handler) {
		console.error(
			`[EventRouter] No handler found for event type: ${event.type}`
		);
		return;
	}

	try {
		await handler(context, event.data);
	} catch (error) {
		console.error(`[EventRouter] Error handling ${event.type}:`, error);
	}
}

export type { EventContext, EventHandler };
