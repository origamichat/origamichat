import type { GetMessagesResponse } from "@cossistant/types/api/message";
import type { Message } from "@cossistant/types/schemas";
import type { InfiniteData } from "@tanstack/react-query";

/**
 * Type for the paginated messages cache structure
 */
export type PaginatedMessagesCache = InfiniteData<GetMessagesResponse>;

/**
 * Add a message to the paginated cache
 * Adds the message to the last page of the cache
 */
export function addMessageToCache(
  cache: PaginatedMessagesCache | undefined,
  message: Message
): PaginatedMessagesCache | undefined {
  if (!cache) return undefined;

  const newPages = [...cache.pages];
  const lastPageIndex = newPages.length - 1;

  if (lastPageIndex >= 0) {
    newPages[lastPageIndex] = {
      ...newPages[lastPageIndex],
      messages: [...newPages[lastPageIndex].messages, message],
    };
  } else {
    // If no pages exist, create a new page with the message
    newPages.push({
      messages: [message],
      nextCursor: undefined,
      hasNextPage: false,
    });
  }

  return {
    ...cache,
    pages: newPages,
  };
}

/**
 * Set initial messages in the cache
 * Creates a single page with all the messages
 */
export function setInitialMessagesInCache(
  messages: Message[]
): PaginatedMessagesCache {
  return {
    pages: [
      {
        messages,
        nextCursor: undefined,
        hasNextPage: false,
      },
    ],
    pageParams: [undefined],
  };
}

/**
 * Remove a message from the paginated cache by ID
 */
export function removeMessageFromCache(
  cache: PaginatedMessagesCache | undefined,
  messageId: string
): PaginatedMessagesCache | undefined {
  if (!cache) return undefined;

  const newPages = cache.pages.map((page) => ({
    ...page,
    messages: page.messages.filter((msg) => msg.id !== messageId),
  }));

  return {
    ...cache,
    pages: newPages,
  };
}

/**
 * Update a message in the paginated cache
 */
export function updateMessageInCache(
  cache: PaginatedMessagesCache | undefined,
  messageId: string,
  updater: (message: Message) => Message
): PaginatedMessagesCache | undefined {
  if (!cache) return undefined;

  const newPages = cache.pages.map((page) => ({
    ...page,
    messages: page.messages.map((msg) =>
      msg.id === messageId ? updater(msg) : msg
    ),
  }));

  return {
    ...cache,
    pages: newPages,
  };
}

/**
 * Get all messages from the paginated cache as a flat array
 */
export function getAllMessagesFromCache(
  cache: PaginatedMessagesCache | undefined
): Message[] {
  if (!cache?.pages) return [];
  return cache.pages.flatMap((page) => page.messages);
}