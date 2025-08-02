import type { Message as MessageType } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { useMemo } from "react";

export interface GroupedMessage {
	type?: never; // Discriminant to distinguish from events
	sender: SenderType;
	senderName?: string;
	senderImage?: string;
	messages: MessageType[];
}

export interface ConversationEventItem {
	type: "event";
	id: string;
	event: string;
	timestamp?: Date;
}

export interface UseGroupedMessagesProps {
	messages: MessageType[];
	events?: { id: string; event: string; timestamp?: Date }[];
	availableAgents: {
		id: string;
		name: string;
		image: string | null;
		lastOnlineAt: string | null;
	}[];
}

// Helper function to determine sender info
const getSenderInfo = (
	sender: SenderType,
	availableAgents: {
		id: string;
		name: string;
		image: string | null;
		lastOnlineAt: string | null;
	}[]
) => {
	let senderName = "Support";
	let senderImage: string | undefined;

	if (sender === SenderType.VISITOR) {
		senderName = "You";
	} else if (sender === SenderType.TEAM_MEMBER || sender === SenderType.AI) {
		const firstAgent = availableAgents[0];
		if (firstAgent) {
			senderName = firstAgent.name;
			senderImage = firstAgent.image || undefined;
		}
	}

	return { senderName, senderImage };
};

// Helper function to group messages by sender
const groupMessagesBySender = (
	messages: MessageType[],
	availableAgents: {
		id: string;
		name: string;
		image: string | null;
		lastOnlineAt: string | null;
	}[]
): GroupedMessage[] => {
	const groupedMessages: GroupedMessage[] = [];
	let currentGroup: GroupedMessage | null = null;

	for (const message of messages) {
		if (currentGroup && currentGroup.sender === message.sender) {
			currentGroup.messages.push(message);
		} else {
			if (currentGroup) {
				groupedMessages.push(currentGroup);
			}

			const { senderName, senderImage } = getSenderInfo(
				message.sender,
				availableAgents
			);

			currentGroup = {
				sender: message.sender,
				senderName,
				senderImage,
				messages: [message],
			};
		}
	}

	if (currentGroup) {
		groupedMessages.push(currentGroup);
	}

	return groupedMessages;
};

// Helper function to get timestamp for sorting
const getItemTimestamp = (
	item: GroupedMessage | ConversationEventItem
): number => {
	return item.type === "event"
		? item.timestamp?.getTime() || 0
		: item.messages[0]?.timestamp.getTime() || 0;
};

export const useGroupedMessages = ({
	messages,
	events = [],
	availableAgents = [],
}: UseGroupedMessagesProps) => {
	return useMemo(() => {
		// Group messages by sender
		const groupedMessages = groupMessagesBySender(messages, availableAgents);

		// Add events to the list
		const allItems: (GroupedMessage | ConversationEventItem)[] = [
			...groupedMessages,
			...events.map((event) => ({ type: "event" as const, ...event })),
		];

		// Sort by timestamp
		allItems.sort((a, b) => getItemTimestamp(a) - getItemTimestamp(b));

		return allItems;
	}, [messages, events, availableAgents]);
};
