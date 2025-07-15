export const MessageType = {
	TEXT: "text",
	IMAGE: "image",
	FILE: "file",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const SenderType = {
	VISITOR: "visitor",
	TEAM_MEMBER: "team_member",
	AI: "ai",
} as const;

export type SenderType = (typeof SenderType)[keyof typeof SenderType];

export const ConversationStatus = {
	OPEN: "open",
	RESOLVED: "resolved",
	BLOCKED: "blocked",
	PENDING: "pending",
} as const;

export type ConversationStatus =
	(typeof ConversationStatus)[keyof typeof ConversationStatus];

export const ConversationPriority = {
	LOW: "low",
	NORMAL: "normal",
	HIGH: "high",
	URGENT: "urgent",
} as const;

export type ConversationPriority =
	(typeof ConversationPriority)[keyof typeof ConversationPriority];

export const WebsiteInstallationTarget = {
	NEXTJS: "nextjs",
	REACT: "react",
} as const;

export type WebsiteInstallationTarget =
	(typeof WebsiteInstallationTarget)[keyof typeof WebsiteInstallationTarget];

export const APIKeyType = {
	PRIVATE: "private",
	PUBLIC: "public",
} as const;

export type APIKeyType = (typeof APIKeyType)[keyof typeof APIKeyType];

export const ConversationSource = {
	WEBSITE: "website",
	EMAIL: "email",
	DISCORD: "discord",
	SLACK: "slack",
	TWITTER: "twitter",
	TELEGRAM: "telegram",
	WHATSAPP: "whatsapp",
} as const;

export type ConversationSource =
	(typeof ConversationSource)[keyof typeof ConversationSource];
