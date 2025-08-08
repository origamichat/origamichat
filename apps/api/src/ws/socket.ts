import { db } from "@api/db";
import type { ApiKeyWithWebsiteAndOrganization } from "@api/db/queries/api-keys";
import {
	AuthValidationError,
	type AuthValidationOptions,
	performAuthentication,
} from "@api/lib/auth-validation";
import { pubsub, type Subscription } from "@api/lib/pubsub";
import {
	isValidEventType,
	type RealtimeEvent,
	validateRealtimeEvent,
} from "@cossistant/types/realtime-events";
import type { ServerWebSocket } from "bun";
import type { Context } from "hono";
import { createBunWebSocket } from "hono/bun";
import { type EventContext, routeEvent } from "./router";

export type ConnectionData = {
	connectionId: string;
	userId?: string;
	connectedAt: number;
	apiKey?: ApiKeyWithWebsiteAndOrganization;
	organizationId?: string;
	websiteId?: string;
};

const connections = new Map<string, ConnectionData>();
// Map connectionId -> active WebSocket instance
type RawSocket = ServerWebSocket & { connectionId?: string };
const wsByConnectionId = new Map<string, RawSocket>();
// Track which connections belong to a website
const websiteToConnections = new Map<string, Set<string>>();
// One SSE subscription per website on this instance (+ refcount)
const websiteSubscriptions = new Map<
	string,
	{ sub: Subscription; count: number }
>();
// One SSE subscription per connection on this instance
const connectionSubscriptions = new Map<string, Subscription>();

// Enable auth logging by setting ENABLE_AUTH_LOGS=true
const AUTH_LOGS_ENABLED = process.env.ENABLE_AUTH_LOGS === "true";

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

async function ensureConnectionSubscription(
	connectionId: string
): Promise<void> {
	if (connectionSubscriptions.has(connectionId)) {
		return;
	}
	const sub = await pubsub.subscribe(
		async (incomingEvent) => {
			const client = wsByConnectionId.get(connectionId);
			if (!client) {
				return;
			}
			try {
				client.send(JSON.stringify(incomingEvent));
			} catch {
				// ignore send errors
			}
		},
		{ connectionId }
	);
	connectionSubscriptions.set(connectionId, sub);
}

async function ensureWebsiteSubscription(websiteId: string): Promise<void> {
	const existing = websiteSubscriptions.get(websiteId);
	if (existing) {
		existing.count += 1;
		websiteSubscriptions.set(websiteId, existing);
		return;
	}

	const sub = await pubsub.subscribe(
		async (incomingEvent) => {
			const members = websiteToConnections.get(websiteId);
			if (!members) {
				return;
			}
			const payload = JSON.stringify(incomingEvent);
			for (const memberConnId of members) {
				const client = wsByConnectionId.get(memberConnId);
				if (!client) {
					continue;
				}
				try {
					client.send(payload);
				} catch {
					// ignore send errors
				}
			}
		},
		{ websiteId }
	);
	websiteSubscriptions.set(websiteId, { sub, count: 1 });
}

function cleanupConnection(connectionData: ConnectionData): void {
	// Remove from maps
	connections.delete(connectionData.connectionId);
	wsByConnectionId.delete(connectionData.connectionId);

	// Unsubscribe connection-specific subscription
	const connSub = connectionSubscriptions.get(connectionData.connectionId);
	if (connSub) {
		connSub.unsubscribe().catch(() => {});
		connectionSubscriptions.delete(connectionData.connectionId);
	}

	// Decrement website refcount and possibly unsubscribe
	const websiteId = connectionData.websiteId;
	if (websiteId) {
		const members = websiteToConnections.get(websiteId);
		if (members) {
			members.delete(connectionData.connectionId);
			if (members.size === 0) {
				websiteToConnections.delete(websiteId);
			} else {
				websiteToConnections.set(websiteId, members);
			}
		}

		const entry = websiteSubscriptions.get(websiteId);
		if (entry) {
			entry.count -= 1;
			if (entry.count <= 0) {
				entry.sub.unsubscribe().catch(() => {});
				websiteSubscriptions.delete(websiteId);
			} else {
				websiteSubscriptions.set(websiteId, entry);
			}
		}
	}
}

/**
 * Extract authentication credentials from WebSocket context
 */
function extractAuthCredentials(c: Context): {
	privateKey: string | undefined;
	publicKey: string | undefined;
	actualOrigin: string | undefined;
} {
	// Try headers first (for non-browser clients)
	const authHeader = c.req.header("Authorization");
	let privateKey = authHeader?.split(" ")[1];
	let publicKey = c.req.header("X-Public-Key");

	// Fallback to URL parameters (for browser WebSocket clients)
	if (!privateKey) {
		privateKey = c.req.query("token");
	}
	if (!publicKey) {
		publicKey = c.req.query("publicKey");
	}

	const origin = c.req.header("Origin");
	const secWebSocketOrigin = c.req.header("Sec-WebSocket-Origin");
	const actualOrigin = origin || secWebSocketOrigin;

	return { privateKey, publicKey, actualOrigin };
}

/**
 * Parse protocol and hostname from origin
 */
function parseOriginDetails(actualOrigin: string | undefined): {
	protocol: string | undefined;
	hostname: string | undefined;
} {
	if (!actualOrigin) {
		return { protocol: undefined, hostname: undefined };
	}

	try {
		const url = new URL(actualOrigin);
		// Convert HTTP protocols to WebSocket protocols for validation
		const protocol =
			url.protocol === "https:"
				? "wss:"
				: url.protocol === "http:"
					? "ws:"
					: url.protocol;
		return { protocol, hostname: url.hostname };
	} catch (error) {
		if (AUTH_LOGS_ENABLED) {
			console.log("[WebSocket Auth] Failed to parse origin:", error);
		}
		return { protocol: undefined, hostname: undefined };
	}
}

/**
 * Extract protocol and hostname from request if not available from origin
 */
function extractFromRequest(c: Context): {
	protocol: string | undefined;
	hostname: string | undefined;
} {
	const hostHeader = c.req.header("Host");
	if (!hostHeader) {
		return { protocol: undefined, hostname: undefined };
	}

	const hostname = hostHeader.split(":")[0];
	const isSecure = c.req.url.startsWith("wss://");
	const protocol = isSecure ? "wss:" : "ws:";

	return { protocol, hostname };
}

/**
 * Log authentication attempt if logging is enabled
 */
function logAuthAttempt(
	hasPrivateKey: boolean,
	hasPublicKey: boolean,
	actualOrigin: string | undefined,
	url: string
): void {
	if (AUTH_LOGS_ENABLED) {
		console.log("[WebSocket Auth] Authentication attempt:", {
			hasPrivateKey,
			hasPublicKey,
			origin: actualOrigin,
			url,
		});
	}
}

/**
 * Log authentication success if logging is enabled
 */
function logAuthSuccess(result: {
	apiKey: ApiKeyWithWebsiteAndOrganization;
	isTestKey: boolean;
}): void {
	if (AUTH_LOGS_ENABLED) {
		console.log("[WebSocket Auth] Authentication successful:", {
			apiKeyId: result.apiKey.id,
			organizationId: result.apiKey.organization.id,
			websiteId: result.apiKey.website?.id,
			isTestKey: result.isTestKey,
		});
	}
}

/**
 * Authenticate WebSocket connection
 */
async function authenticateWebSocketConnection(c: Context): Promise<{
	apiKey: ApiKeyWithWebsiteAndOrganization;
	isTestKey: boolean;
} | null> {
	try {
		// Extract credentials
		const { privateKey, publicKey, actualOrigin } = extractAuthCredentials(c);

		logAuthAttempt(!!privateKey, !!publicKey, actualOrigin, c.req.url);

		// Parse origin details
		let { protocol, hostname } = parseOriginDetails(actualOrigin);

		// Fallback to request headers if no origin
		if (!hostname) {
			const requestDetails = extractFromRequest(c);
			protocol = requestDetails.protocol;
			hostname = requestDetails.hostname;
		}

		const options: AuthValidationOptions = {
			origin: actualOrigin,
			protocol,
			hostname,
		};

		const result = await performAuthentication(
			privateKey,
			publicKey,
			db,
			options
		);

		logAuthSuccess(result);
		return result;
	} catch (error) {
		if (AUTH_LOGS_ENABLED) {
			console.error("[WebSocket Auth] Authentication failed:", error);
		}

		if (error instanceof AuthValidationError) {
			// Return null to handle the error in onOpen
			return null;
		}

		throw error;
	}
}

export const upgradedWebsocket = upgradeWebSocket(async (c) => {
	// Perform authentication during the upgrade phase
	const authResult = await authenticateWebSocketConnection(c);

	return {
		onOpen(evt, ws) {
			const connectionId = generateConnectionId();

			// Check if authentication was successful
			if (!authResult) {
				console.error(
					`[WebSocket] Authentication failed for connection: ${connectionId}`
				);
				ws.send(
					JSON.stringify({
						error: "Authentication failed",
						message:
							"Invalid API key or domain not whitelisted. Please check your API key and ensure your domain is whitelisted.",
					})
				);
				ws.close(1008, "Authentication failed");
				return;
			}

			const connectionData: ConnectionData = {
				connectionId,
				connectedAt: Date.now(),
				apiKey: authResult.apiKey,
				organizationId: authResult.apiKey.organization.id,
				websiteId: authResult.apiKey.website?.id,
			};

			connections.set(connectionId, connectionData);
			// Track socket for this connection
			wsByConnectionId.set(connectionId, ws.raw as RawSocket);

			// Store just the connectionId as a custom property
			if (ws.raw) {
				(ws.raw as ServerWebSocket & { connectionId?: string }).connectionId =
					connectionId;
			}

			console.log(
				`[WebSocket] Connection opened: ${connectionId} for organization: ${connectionData.organizationId}`
			);

			// Generate a user ID (in production, this might come from the auth system)
			const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
			connectionData.userId = userId;

			// Send successful connection message
			ws.send(
				JSON.stringify({
					type: "CONNECTION_ESTABLISHED",
					data: {
						connectionId,
						userId,
						organizationId: connectionData.organizationId,
						websiteId: connectionData.websiteId,
						timestamp: Date.now(),
					},
				})
			);

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
				websiteId: connectionData.websiteId,
				organizationId: connectionData.organizationId,
				ws: undefined,
			};

			routeEvent(event, context);

			// Subscribe to connection-specific channel to receive targeted events
			ensureConnectionSubscription(connectionId).catch(() => {});

			// Subscribe (once per website on this instance) and track membership
			if (connectionData.websiteId) {
				const websiteId = connectionData.websiteId;
				const set = websiteToConnections.get(websiteId) ?? new Set<string>();
				set.add(connectionId);
				websiteToConnections.set(websiteId, set);
				ensureWebsiteSubscription(websiteId).catch(() => {});
			}
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
				ws.send(
					JSON.stringify({
						error: "Connection not authenticated",
						message: "Please reconnect with valid authentication.",
					})
				);
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
					websiteId: connectionData.websiteId,
					organizationId: connectionData.organizationId,
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
					websiteId: connectionData.websiteId,
					organizationId: connectionData.organizationId,
					ws: undefined,
				};

				routeEvent(event, context);
			}

			cleanupConnection(connectionData);
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
