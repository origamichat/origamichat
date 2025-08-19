import { z } from "zod";
import {
	ConversationEventType,
	ConversationStatus,
	MessageType,
	MessageVisibility,
} from "./enums";

export const MessageSchema = z.object({
	id: z.string(),
	bodyMd: z.string(),
	type: z.enum([MessageType.TEXT, MessageType.IMAGE, MessageType.FILE]),
	userId: z.string().nullable(),
	aiAgentId: z.string().nullable(),
	visitorId: z.string().nullable(),
	conversationId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullable(),
	visibility: z.enum([MessageVisibility.PUBLIC, MessageVisibility.PRIVATE]),
});

export type Message = z.infer<typeof MessageSchema>;

export const ConversationSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	visitorId: z.string(),
	websiteId: z.string(),
	status: z
		.enum([
			ConversationStatus.OPEN,
			ConversationStatus.RESOLVED,
			ConversationStatus.BLOCKED,
			ConversationStatus.PENDING,
		])
		.default(ConversationStatus.OPEN),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export const ConversationEventSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	conversationId: z.string(),
	type: z.enum([
		ConversationEventType.ASSIGNED,
		ConversationEventType.UNASSIGNED,
		ConversationEventType.PARTICIPANT_REQUESTED,
		ConversationEventType.PARTICIPANT_JOINED,
		ConversationEventType.PARTICIPANT_LEFT,
		ConversationEventType.STATUS_CHANGED,
		ConversationEventType.PRIORITY_CHANGED,
		ConversationEventType.TAG_ADDED,
		ConversationEventType.TAG_REMOVED,
		ConversationEventType.RESOLVED,
		ConversationEventType.REOPENED,
	]),
	actorUserId: z.string().nullable(),
	actorAiAgentId: z.string().nullable(),
	targetUserId: z.string().nullable(),
	targetAiAgentId: z.string().nullable(),
	message: z.string().optional(),
	metadata: z.record(z.unknown()).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullable(),
});

export type ConversationEvent = z.infer<typeof ConversationEventSchema>;
