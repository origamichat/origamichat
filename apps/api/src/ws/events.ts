import type { ServerMessage } from "@api/ws/schema";
import { publishToConversation, publishToWebsite } from "./pubsub";

export async function publishNewMessage({
	conversationId,
	messageId,
	content,
	senderType,
	senderId,
	websiteId,
	organizationId,
}: {
	conversationId: string;
	messageId: string;
	content: unknown;
	senderType: "visitor" | "user" | "ai_agent";
	senderId: string;
	websiteId: string;
	organizationId: string;
}) {
	const message: ServerMessage = {
		type: "new_message",
		conversationId,
		messageId,
		content,
		senderType,
		senderId,
		createdAt: new Date().toISOString(),
		websiteId,
		organizationId,
	};

	await publishToConversation(
		conversationId,
		websiteId,
		organizationId,
		message
	);
}

export async function publishConversationStatusChange({
	conversationId,
	status,
	websiteId,
	organizationId,
}: {
	conversationId: string;
	status: "open" | "pending" | "resolved" | "closed";
	websiteId: string;
	organizationId: string;
}) {
	const message: ServerMessage = {
		type: "conversation_status_changed",
		conversationId,
		status,
		websiteId,
		organizationId,
	};

	await publishToConversation(
		conversationId,
		websiteId,
		organizationId,
		message
	);
}

export async function publishConversationAssignment({
	conversationId,
	assignedTeamMemberId,
	websiteId,
	organizationId,
}: {
	conversationId: string;
	assignedTeamMemberId: string | null;
	websiteId: string;
	organizationId: string;
}) {
	const message: ServerMessage = {
		type: "conversation_assigned",
		conversationId,
		assignedTeamMemberId,
		websiteId,
		organizationId,
	};

	await publishToConversation(
		conversationId,
		websiteId,
		organizationId,
		message
	);
}

export async function publishVisitorOnline({
	conversationId,
	visitorId,
	websiteId,
	organizationId,
}: {
	conversationId: string;
	visitorId: string;
	websiteId: string;
	organizationId: string;
}) {
	const message: ServerMessage = {
		type: "visitor_online",
		conversationId,
		visitorId,
		websiteId,
		organizationId,
	};

	// Only publish to website team, not to the visitor themselves
	await publishToWebsite(websiteId, organizationId, message);
}

export async function publishVisitorOffline({
	conversationId,
	visitorId,
	websiteId,
	organizationId,
}: {
	conversationId: string;
	visitorId: string;
	websiteId: string;
	organizationId: string;
}) {
	const message: ServerMessage = {
		type: "visitor_offline",
		conversationId,
		visitorId,
		websiteId,
		organizationId,
	};

	// Only publish to website team, not to the visitor themselves
	await publishToWebsite(websiteId, organizationId, message);
}
