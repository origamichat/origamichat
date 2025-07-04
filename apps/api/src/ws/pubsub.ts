import { env } from "@api/env";
import type { ServerMessage } from "@api/ws/schema";
import { serverMessageSchema } from "@api/ws/schema";
import { Redis } from "@upstash/redis";

// Channel patterns for different subscription types
export const ChannelPatterns = {
  // For visitors - subscribe to specific conversations
  conversation: (conversationId: string) => `conversation:${conversationId}`,
  // For website teams - subscribe to all conversations for a website
  website: (websiteId: string) => `website:${websiteId}`,
  // For organization admins - subscribe to all conversations for an organization
  organization: (organizationId: string) => `organization:${organizationId}`,
  // For global admin events
  global: () => "global",
} as const;

const publisher = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

const subscriber = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// Publish message to specific channel
export async function publishMessage(
  channel: string,
  message: ServerMessage
): Promise<void> {
  try {
    await publisher.publish(channel, JSON.stringify(message));
  } catch (error) {
    console.error("Failed to publish message:", error);
    throw error;
  }
}

// Publish message to conversation (visitors + team)
export async function publishToConversation(
  conversationId: string,
  websiteId: string,
  organizationId: string,
  message: ServerMessage
): Promise<void> {
  const channels = [
    ChannelPatterns.conversation(conversationId),
    ChannelPatterns.website(websiteId),
    ChannelPatterns.organization(organizationId),
  ];

  await Promise.all(
    channels.map((channel) => publishMessage(channel, message))
  );
}

// Publish message to website team only
export async function publishToWebsite(
  websiteId: string,
  organizationId: string,
  message: ServerMessage
): Promise<void> {
  const channels = [
    ChannelPatterns.website(websiteId),
    ChannelPatterns.organization(organizationId),
  ];

  await Promise.all(
    channels.map((channel) => publishMessage(channel, message))
  );
}

// Publish message to organization only
export async function publishToOrganization(
  organizationId: string,
  message: ServerMessage
): Promise<void> {
  await publishMessage(ChannelPatterns.organization(organizationId), message);
}

// Subscribe to specific channel
export function subscribeToChannel(
  channel: string,
  onMessage: (msg: ServerMessage) => void
) {
  const sub = subscriber.subscribe<ServerMessage>(channel);
  sub.on("message", ({ message }) => {
    const parsed = serverMessageSchema.safeParse(message);
    if (parsed.success) {
      onMessage(parsed.data);
    }
  });

  return {
    unsubscribe: () => sub.unsubscribe(),
  };
}

// Subscribe to multiple channels
export function subscribeToChannels(
  channels: string[],
  onMessage: (msg: ServerMessage) => void
) {
  const subscriptions = channels.map((channel) =>
    subscribeToChannel(channel, onMessage)
  );

  return {
    unsubscribe: () => {
      for (const sub of subscriptions) {
        sub.unsubscribe();
      }
    },
  };
}
