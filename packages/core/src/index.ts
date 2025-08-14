// Main client exports

// Type exports from shared types package
export type {
  CossistantConfig,
  CossistantError,
  Message,
  PublicWebsiteResponse,
} from "@cossistant/types";

// Schema exports for runtime validation
export { ConversationSchema, MessageSchema } from "@cossistant/types";
export { CossistantClient, CossistantClient as default } from "./client";
export { CossistantRestClient } from "./rest-client";
// Core-specific exports
export { CossistantAPIError } from "./types";

export {
  clearAllVisitorIds,
  clearVisitorId,
  getVisitorId,
  setVisitorId,
} from "./visitor-tracker";
export {
  CossistantWebSocketClient,
  type CossistantWebSocketConfig,
  type WebSocketEventHandlers,
} from "./websocket-client";
