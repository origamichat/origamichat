import { type Message as MessageType, SenderType } from "@cossistant/types";
import type React from "react";
import { useEffect, useRef } from "react";
import { useGroupedMessages } from "../hooks";
import { cn } from "../utils";
import { ConversationEvent } from "./conversation-event";
import { MessageGroup } from "./message-group";
import { TypingIndicator } from "./typing-indicator";

export interface MessageListProps {
	messages: MessageType[];
	events?: {
		id: string;
		event: string;
		timestamp?: Date;
		agentAvatar?: string;
		agentName?: string;
	}[];
	isTyping?: {
		type: SenderType;
	};
	className?: string;
	availableAgents: {
		id: string;
		name: string;
		image: string | null;
		lastOnlineAt: string | null;
	}[];
}

export const MessageList: React.FC<MessageListProps> = ({
	messages,
	events = [],
	isTyping,
	className,
	availableAgents = [],
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Use the hook to get grouped messages and events
	const groupedMessages = useGroupedMessages({
		messages,
		events,
		availableAgents,
	});

	// Auto-scroll to bottom when new messages or events are added
	// biome-ignore lint/correctness/useExhaustiveDependencies: ok here
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({
				top: scrollRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [messages.length, events.length, isTyping]);

	return (
		<div
			className={cn(
				"overflow-y-auto scroll-smooth px-4 py-6",
				"scrollbar-thin scrollbar-thumb-co-background-300 scrollbar-track-transparent",
				"h-full", // Take full height of parent flex container
				className
			)}
			id="message-list"
			ref={scrollRef}
		>
			<div className="flex min-h-full flex-col gap-4">
				{groupedMessages.map((item, index) => {
					if (item.type === "event") {
						return (
							<ConversationEvent
								event={item.event}
								key={item.id}
								senderImage={item.senderImage}
								senderName={item.senderName}
								senderType={item.senderType}
								timestamp={item.timestamp}
							/>
						);
					}
					return (
						<MessageGroup
							key={`group-${index}`}
							messages={item.messages}
							senderImage={item.senderImage}
							senderName={item.senderName}
						/>
					);
				})}
				{isTyping && (
					<TypingIndicator
						isAI={isTyping.type === SenderType.AI}
						senderImage={availableAgents[0]?.image || undefined}
						senderName={availableAgents[0]?.name || "Support"}
					/>
				)}
			</div>
		</div>
	);
};
