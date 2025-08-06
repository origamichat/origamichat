import { z } from "zod";

/**
 * Central event system for real-time communication
 * All WebSocket and Redis Pub/Sub events are defined here
 */
export const RealtimeEvents = {
	USER_CONNECTED: z.object({
		userId: z.string(),
		connectionId: z.string(),
		timestamp: z.number(),
	}),
	USER_DISCONNECTED: z.object({
		userId: z.string(),
		connectionId: z.string(),
		timestamp: z.number(),
	}),
	USER_PRESENCE_UPDATE: z.object({
		userId: z.string(),
		status: z.enum(["online", "away", "offline"]),
		lastSeen: z.number(),
	}),
} as const;

export type RealtimeEventType = keyof typeof RealtimeEvents;

export type RealtimeEvent<T extends RealtimeEventType = RealtimeEventType> = {
	type: T;
	data: z.infer<(typeof RealtimeEvents)[T]>;
	timestamp: number;
};

export type RealtimeEventData<T extends RealtimeEventType> = z.infer<
	(typeof RealtimeEvents)[T]
>;

/**
 * Validates an event against its schema
 */
export function validateRealtimeEvent<T extends RealtimeEventType>(
	type: T,
	data: unknown
): RealtimeEventData<T> {
	const schema = RealtimeEvents[type];
	return schema.parse(data);
}

/**
 * Type guard to check if a string is a valid event type
 */
export function isValidEventType(type: unknown): type is RealtimeEventType {
	return typeof type === "string" && type in RealtimeEvents;
}
