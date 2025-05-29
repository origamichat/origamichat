export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

export enum SenderType {
  VISITOR = "visitor",
  TEAM_MEMBER = "team_member",
  AI = "ai",
}

export enum ConversationStatus {
  OPEN = "open",
  RESOLVED = "resolved",
  BLOCKED = "blocked",
  PENDING = "pending",
}

export enum ConversationPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

export enum APIKeyType {
  PRIVATE = "private",
  PUBLIC = "public",
}
