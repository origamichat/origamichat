export type {
  CossistantConfig,
  CossistantError,
  Message,
  PublicWebsiteResponse,
} from "@cossistant/types";

export { conversationSchema, messageSchema } from "@cossistant/types";
export { CossistantClient, CossistantClient as default } from "./client";
export { CossistantRestClient } from "./rest-client";
// Core-specific exports
export { CossistantAPIError } from "./types";
// Utility exports
export { generateConversationId, generateMessageId } from "./utils";
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
