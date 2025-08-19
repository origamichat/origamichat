export const MessageType = {
	TEXT: "text",
	IMAGE: "image",
	FILE: "file",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const MentionEntityType = {
	USER: "user",
	AGENT: "agent",
	TOOL: "tool",
} as const;

export type MentionEntityType =
	(typeof MentionEntityType)[keyof typeof MentionEntityType];

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

export const MessageVisibility = {
	PUBLIC: "public",
	PRIVATE: "private",
} as const;

export const ConversationEventType = {
	ASSIGNED: "assigned",
	UNASSIGNED: "unassigned",
	PARTICIPANT_REQUESTED: "participant_requested",
	PARTICIPANT_JOINED: "participant_joined",
	PARTICIPANT_LEFT: "participant_left",
	STATUS_CHANGED: "status_changed",
	PRIORITY_CHANGED: "priority_changed",
	TAG_ADDED: "tag_added",
	TAG_REMOVED: "tag_removed",
	RESOLVED: "resolved",
	REOPENED: "reopened",
} as const;

export const ConversationParticipationStatus = {
	REQUESTED: "requested",
	ACTIVE: "active",
	LEFT: "left",
	DECLINED: "declined",
} as const;

export type MentionsIndexItem = {
	type: MentionEntityType;
	id: string;
	count: number;
};

export type ConversationParticipationStatus =
	(typeof ConversationParticipationStatus)[keyof typeof ConversationParticipationStatus];

export type ConversationEventType =
	(typeof ConversationEventType)[keyof typeof ConversationEventType];

export type MessageVisibility =
	(typeof MessageVisibility)[keyof typeof MessageVisibility];

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
