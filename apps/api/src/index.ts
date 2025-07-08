import { env } from "@api/env";
import { routers } from "@api/rest/routers";
import { createTRPCContext } from "@api/trpc/init";
import { origamiTRPCRouter } from "@api/trpc/routers/_app";
import { checkHealth } from "@api/utils/health";
import {
	ChannelPatterns,
	publishMessage,
	subscribeToChannel,
} from "@api/ws/pubsub";
import { clientMessageSchema, type ServerMessage } from "@api/ws/schema";
import { auth } from "@cossistant/database";
import { swaggerUI } from "@hono/swagger-ui";
import { trpcServer } from "@hono/trpc-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { ServerWebSocket } from "bun";
import { createBunWebSocket } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import type { WSContext } from "hono/ws";

const app = new OpenAPIHono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>();

const acceptedOrigins = [
	"http://localhost:3000",
	"https://cossistant.com",
	"https://www.cossistant.com",
	"https://cossistant.com",
	"https://www.cossistant.com",
];

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

// Track WebSocket connections and their subscriptions
interface SocketInfo {
	ws: WSContext<ServerWebSocket>;
	userId?: string;
	userType: "visitor" | "team_member";
	subscriptions: Set<string>;
	organizationId?: string;
	websiteId?: string;
	visitorId?: string;
}

const sockets = new Map<WSContext<ServerWebSocket>, SocketInfo>();
const channelSubscriptions = new Map<string, Set<SocketInfo>>();

// Helper function to add socket to channel
function addSocketToChannel(channel: string, socketInfo: SocketInfo) {
	if (!channelSubscriptions.has(channel)) {
		channelSubscriptions.set(channel, new Set());
	}
	channelSubscriptions.get(channel)?.add(socketInfo);
	socketInfo.subscriptions.add(channel);
}

// Helper function to remove socket from channel
function removeSocketFromChannel(channel: string, socketInfo: SocketInfo) {
	const channelSockets = channelSubscriptions.get(channel);
	if (channelSockets) {
		channelSockets.delete(socketInfo);
		if (channelSockets.size === 0) {
			channelSubscriptions.delete(channel);
		}
	}
	socketInfo.subscriptions.delete(channel);
}

// Helper function to remove socket from all channels
function removeSocketFromAllChannels(socketInfo: SocketInfo) {
	for (const channel of socketInfo.subscriptions) {
		removeSocketFromChannel(channel, socketInfo);
	}
}

// Helper function to broadcast message to channel subscribers
function broadcastToChannel(channel: string, message: ServerMessage) {
	const subscribers = channelSubscriptions.get(channel);
	if (!subscribers) {
		return;
	}

	for (const socketInfo of subscribers) {
		try {
			socketInfo.ws.send(JSON.stringify(message));
		} catch (error) {
			console.error("Failed to send message to socket:", error);
			// Remove broken socket
			removeSocketFromAllChannels(socketInfo);
			sockets.delete(socketInfo.ws);
		}
	}
}

// Set up Redis subscription for each channel pattern
// In a production environment, you might want to use Redis patterns or a more sophisticated approach
const activeChannels = new Set<string>();
const redisSubscriptions = new Map<
	string,
	ReturnType<typeof subscribeToChannel>
>();

function subscribeToRedisChannel(channel: string) {
	if (redisSubscriptions.has(channel)) {
		return;
	}

	try {
		const subscription = subscribeToChannel(channel, (message) => {
			broadcastToChannel(channel, message);
		});
		redisSubscriptions.set(channel, subscription);
		activeChannels.add(channel);
	} catch (error) {
		console.error(
			`Failed to setup Redis subscription for channel ${channel}:`,
			error
		);
	}
}

function unsubscribeFromRedisChannel(channel: string) {
	const subscription = redisSubscriptions.get(channel);
	if (subscription && !channelSubscriptions.has(channel)) {
		subscription.unsubscribe();
		redisSubscriptions.delete(channel);
		activeChannels.delete(channel);
	}
}

// Logger middleware
app.use(logger());

// Secure headers middleware
app.use(secureHeaders());

// Health check endpoint
app.get("/health", async (c) => {
	try {
		const health = await checkHealth();
		return c.json({ status: "healthy" }, health ? 200 : 503);
	} catch (_error) {
		return c.json(
			{ status: "unhealthy", error: "Database connection failed" },
			503
		);
	}
});

// CORS middleware
app.use(
	"/*",
	cors({
		origin: acceptedOrigins,
		maxAge: 86_400,
		credentials: true,
	})
);

// WebSocket endpoint
app.use(
	"/ws",
	cors({
		origin: acceptedOrigins,
		maxAge: 86_400,
		credentials: true,
	})
);

app.use("/trpc/*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);

		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);

	return next();
});

// Better-Auth - Handle all auth routes
app.all("/api/auth/*", async (c) => {
	return await auth.handler(c.req.raw);
});

// TRPC routes
app.use(
	"/trpc/*",
	trpcServer({
		router: origamiTRPCRouter,
		createContext: createTRPCContext,
	})
);

app.route("/v1", routers);

app.doc("/openapi", {
	openapi: "3.1.0",
	info: {
		version: "0.0.1",
		title: "Cossistant API",
		description: "Cossistant API",
		license: {
			name: "AGPL-3.0 license",
			url: "https://github.com/origamichat/monorepo/blob/main/LICENSE",
		},
	},
	servers: [
		{
			url: "https://api.cossistant.com",
			description: "Production server",
		},
	],
	security: [
		{
			bearerAuth: [],
		},
	],
});

app.get(
	"/docs",
	swaggerUI({
		url: "/docs/openapi.json",
	})
);

app.use(
	"/ws",
	upgradeWebSocket(async (c) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			return {
				onMessage: () => {
					//
				},
				onClose: () => {
					//
				},
				onOpen: () => {
					//
				},
			};
		}

		return {
			onMessage(event, ws) {
				const socketInfo = sockets.get(ws);
				if (!socketInfo) {
					return;
				}

				try {
					const message = clientMessageSchema.parse(
						JSON.parse(event.data.toString())
					);

					switch (message.type) {
						case "ping": {
							publishMessage(ChannelPatterns.global(), { type: "pong" });
							break;
						}

						case "subscribe_conversation": {
							const { conversationId } = message;
							const channel = ChannelPatterns.conversation(conversationId);

							// TODO: Add authorization check here
							// Verify that the user has access to this conversation
							// For visitors: check if they own the conversation
							// For team members: check if the conversation belongs to their organization

							addSocketToChannel(channel, socketInfo);
							subscribeToRedisChannel(channel);

							ws.send(
								JSON.stringify({
									type: "subscription_confirmed",
									channel,
								} as ServerMessage)
							);
							break;
						}

						case "subscribe_website": {
							const { websiteId } = message;

							// Only team members can subscribe to website channels
							if (socketInfo.userType !== "team_member") {
								ws.send(
									JSON.stringify({
										type: "subscription_error",
										error:
											"Only team members can subscribe to website channels",
										channel: ChannelPatterns.website(websiteId),
									} as ServerMessage)
								);
								return;
							}

							// TODO: Add authorization check
							// Verify that the user has access to this website

							const channel = ChannelPatterns.website(websiteId);
							addSocketToChannel(channel, socketInfo);
							subscribeToRedisChannel(channel);

							ws.send(
								JSON.stringify({
									type: "subscription_confirmed",
									channel,
								} as ServerMessage)
							);
							break;
						}

						case "unsubscribe_conversation": {
							const { conversationId } = message;
							const channel = ChannelPatterns.conversation(conversationId);
							removeSocketFromChannel(channel, socketInfo);
							unsubscribeFromRedisChannel(channel);
							break;
						}

						case "unsubscribe_website": {
							const { websiteId } = message;
							const channel = ChannelPatterns.website(websiteId);
							removeSocketFromChannel(channel, socketInfo);
							unsubscribeFromRedisChannel(channel);
							break;
						}

						case "typing_start":
						case "typing_stop": {
							const { conversationId } = message;
							const isTyping = message.type === "typing_start";

							// TODO: Add authorization check for the conversation

							// Broadcast typing indicator to conversation channel
							const typingMessage: ServerMessage = {
								type: "typing_indicator",
								conversationId,
								userId: socketInfo.userId || "",
								isTyping,
								websiteId: socketInfo.websiteId || "",
								organizationId: socketInfo.organizationId || "",
								timestamp: Date.now(),
							};

							publishMessage(
								ChannelPatterns.conversation(conversationId),
								typingMessage
							);
							break;
						}

						case "typing_progress": {
							const { conversationId, content } = message;

							// TODO: Add authorization check for the conversation

							// Broadcast typing progress to conversation channel
							const typingProgressMessage: ServerMessage = {
								type: "typing_progress",
								conversationId,
								userId: socketInfo.userId || "",
								userType: socketInfo.userType,
								content,
								websiteId: socketInfo.websiteId || "",
								organizationId: socketInfo.organizationId || "",
								timestamp: Date.now(),
							};

							publishMessage(
								ChannelPatterns.conversation(conversationId),
								typingProgressMessage
							);
							break;
						}

						default: {
							ws.send(
								JSON.stringify({
									type: "subscription_error",
									error: "Unknown message type",
								} as ServerMessage)
							);
							break;
						}
					}
				} catch (error) {
					console.error("Error processing WebSocket message:", error);
					ws.send(
						JSON.stringify({
							type: "subscription_error",
							error: "Invalid message format",
						} as ServerMessage)
					);
				}
			},

			onClose: (event, ws) => {
				const socketInfo = sockets.get(ws);
				if (socketInfo) {
					removeSocketFromAllChannels(socketInfo);
					sockets.delete(ws);
				}
				console.log("WebSocket connection closed");
			},

			onOpen: (event, ws) => {
				// Determine user type and basic info from session
				const userType = session.user.email?.includes("@")
					? "team_member"
					: "visitor";

				const socketInfo: SocketInfo = {
					ws,
					userId: session.user.id,
					userType,
					subscriptions: new Set(),
					// TODO: Extract these from session or database
					organizationId: undefined,
					websiteId: undefined,
					visitorId: userType === "visitor" ? session.user.id : undefined,
				};

				sockets.set(ws, socketInfo);
				console.log("WebSocket connection opened");

				// Send connection established message
				const connectionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				ws.send(
					JSON.stringify({
						type: "connection_established",
						connectionId,
						serverTime: Date.now(),
						timestamp: Date.now(),
					} as ServerMessage)
				);
			},
		};
	})
);

// Export the websocket handler for Bun
export default {
	port: env.PORT,
	fetch: app.fetch,
	websocket,
};
