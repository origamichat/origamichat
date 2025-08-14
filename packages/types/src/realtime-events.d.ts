import type { z } from "zod";
/**
 * Central event system for real-time communication
 * All WebSocket and Redis Pub/Sub events are defined here
 */
export declare const RealtimeEvents: {
  readonly USER_CONNECTED: z.ZodObject<
    {
      userId: z.ZodString;
      connectionId: z.ZodString;
      timestamp: z.ZodNumber;
    },
    "strip",
    z.ZodTypeAny,
    {
      userId: string;
      connectionId: string;
      timestamp: number;
    },
    {
      userId: string;
      connectionId: string;
      timestamp: number;
    }
  >;
  readonly USER_DISCONNECTED: z.ZodObject<
    {
      userId: z.ZodString;
      connectionId: z.ZodString;
      timestamp: z.ZodNumber;
    },
    "strip",
    z.ZodTypeAny,
    {
      userId: string;
      connectionId: string;
      timestamp: number;
    },
    {
      userId: string;
      connectionId: string;
      timestamp: number;
    }
  >;
  readonly USER_PRESENCE_UPDATE: z.ZodObject<
    {
      userId: z.ZodString;
      status: z.ZodEnum<["online", "away", "offline"]>;
      lastSeen: z.ZodNumber;
    },
    "strip",
    z.ZodTypeAny,
    {
      userId: string;
      status: "online" | "away" | "offline";
      lastSeen: number;
    },
    {
      userId: string;
      status: "online" | "away" | "offline";
      lastSeen: number;
    }
  >;
};
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
export declare function validateRealtimeEvent<T extends RealtimeEventType>(
  type: T,
  data: unknown
): RealtimeEventData<T>;
/**
 * Type guard to check if a string is a valid event type
 */
export declare function isValidEventType(
  type: unknown
): type is RealtimeEventType;
//# sourceMappingURL=realtime-events.d.ts.map
