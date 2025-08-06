import {
	isValidEventType,
	type RealtimeEvent,
	validateRealtimeEvent,
} from "@cossistant/types/realtime-events";
import type { ServerWebSocket } from "bun";
import { createBunWebSocket } from "hono/bun";

import { type EventContext, routeEvent } from "./router";

type ConnectionData = {
	connectionId: string;
	userId?: string;
	connectedAt: number;
};

const connections = new Map<string, ConnectionData>();

/**
 * Generates a unique connection ID
 */
function generateConnectionId(): string {
	return `conn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Handles WebSocket connection lifecycle
 */
export const { websocket, upgradeWebSocket } =
	createBunWebSocket<ServerWebSocket>();

/**
 * Get all active connections
 */
export function getActiveConnections(): ConnectionData[] {
	return Array.from(connections.values());
}

/**
 * Get a specific connection by ID
 */
export function getConnection(
	connectionId: string
): ConnectionData | undefined {
	return connections.get(connectionId);
}

export const upgradedWebsocket = upgradeWebSocket(() => {
	return {
		onOpen(evt, ws) {
			const connectionId = generateConnectionId();
			const connectionData: ConnectionData = {
				connectionId,
				connectedAt: Date.now(),
			};

			connections.set(connectionId, connectionData);

			// Store just the connectionId as a custom property
			if (ws.raw) {
				(ws.raw as ServerWebSocket & { connectionId?: string }).connectionId =
					connectionId;
			}

			console.log(`[WebSocket] Connection opened: ${connectionId}`);

			// For now, using a mock userId - in production, this would come from auth
			const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
			connectionData.userId = userId;

			// Emit USER_CONNECTED event
			const event: RealtimeEvent = {
				type: "USER_CONNECTED",
				data: {
					userId,
					connectionId,
					timestamp: Date.now(),
				},
				timestamp: Date.now(),
			};

			const context: EventContext = {
				connectionId,
				userId,
				ws: undefined,
			};

			routeEvent(event, context);
		},

		onMessage(evt, ws) {
			// Get connectionId from the WebSocket and look up data from our Map
			const connectionId = ws.raw
				? (ws.raw as ServerWebSocket & { connectionId?: string }).connectionId
				: undefined;
			const connectionData = connectionId
				? connections.get(connectionId)
				: undefined;

			if (!connectionData) {
				console.error("[WebSocket] No connection data found");
				return;
			}

			try {
				const message = JSON.parse(evt.data.toString());

				if (!(message.type && isValidEventType(message.type))) {
					console.error(`[WebSocket] Invalid event type: ${message.type}`);
					ws.send(
						JSON.stringify({
							error: "Invalid event type",
							type: message.type,
						})
					);
					return;
				}

				// Validate event data
				const validatedData = validateRealtimeEvent(message.type, message.data);

				const event: RealtimeEvent = {
					type: message.type,
					data: validatedData,
					timestamp: Date.now(),
				};

				const context: EventContext = {
					connectionId: connectionData.connectionId,
					userId: connectionData.userId,
					ws: undefined,
				};

				routeEvent(event, context);
			} catch (error) {
				console.error("[WebSocket] Error processing message:", error);
				ws.send(
					JSON.stringify({
						error: "Invalid message format",
						details: error instanceof Error ? error.message : "Unknown error",
					})
				);
			}
		},

		onClose(evt, ws) {
			// Get connectionId from the WebSocket and look up data from our Map
			const connectionId = ws.raw
				? (ws.raw as ServerWebSocket & { connectionId?: string }).connectionId
				: undefined;
			const connectionData = connectionId
				? connections.get(connectionId)
				: undefined;

			if (!connectionData) {
				console.error("[WebSocket] No connection data found on close");
				return;
			}

			console.log(
				`[WebSocket] Connection closed: ${connectionData.connectionId}`
			);

			// Emit USER_DISCONNECTED event
			if (connectionData.userId) {
				const event: RealtimeEvent = {
					type: "USER_DISCONNECTED",
					data: {
						userId: connectionData.userId,
						connectionId: connectionData.connectionId,
						timestamp: Date.now(),
					},
					timestamp: Date.now(),
				};

				const context: EventContext = {
					connectionId: connectionData.connectionId,
					userId: connectionData.userId,
					ws: undefined,
				};

				routeEvent(event, context);
			}

			connections.delete(connectionData.connectionId);
		},

		onError(evt, ws) {
			// Get connectionId from the WebSocket and look up data from our Map
			const connectionId = ws.raw
				? (ws.raw as ServerWebSocket & { connectionId?: string }).connectionId
				: undefined;
			const connectionData = connectionId
				? connections.get(connectionId)
				: undefined;

			console.error(
				`[WebSocket] Error on connection ${connectionData?.connectionId}:`,
				evt
			);
		},
	};
});
