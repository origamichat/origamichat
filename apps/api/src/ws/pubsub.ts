import { Redis } from "@upstash/redis";
import { env } from "@api/env";
import { serverMessageSchema } from "@api/ws/schema";
import type { ServerMessage } from "@api/ws/schema";

const CHANNEL = "ws:messages";

const publisher = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

const subscriber = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});

export async function publishMessage(message: ServerMessage) {
    await publisher.publish(CHANNEL, JSON.stringify(message));
}

export function subscribeMessages(onMessage: (msg: ServerMessage) => void) {
    const sub = subscriber.subscribe<ServerMessage>(CHANNEL);
    sub.on("message", ({ message }) => {
        const parsed = serverMessageSchema.safeParse(message);
        if (parsed.success) {
            onMessage(parsed.data);
        }
    });
}
