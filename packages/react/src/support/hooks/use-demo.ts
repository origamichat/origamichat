import type { Message } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { useEffect, useState } from "react";

type EventType =
	| "agent_joined"
	| "conversation_resolved"
	| "ai_analyzing"
	| "ai_struggling";

type DemoStep =
	| {
			type: "message";
			delay: number;
			sender: SenderType;
			content: string;
			senderName?: string;
	  }
	| {
			type: "event";
			delay: number;
			eventType: EventType;
			agentName?: string;
	  };

const demoSequence: DemoStep[] = [
	{
		type: "message",
		delay: 2500,
		sender: SenderType.VISITOR,
		content:
			"Hi! I installed @cossistant/react but the Support component isn't showing up I get an error, can you help?",
	},
	{
		type: "event",
		delay: 800,
		eventType: "ai_analyzing",
	},
	{
		type: "message",
		delay: 3200,
		sender: SenderType.AI,
		content: "Of course, let me help! Are you using Next.js app router?",
		senderName: "AI Assistant",
	},
	{
		type: "message",
		delay: 2800,
		sender: SenderType.VISITOR,
		content: "Yes, Next.js 15 with app router",
	},
	{
		type: "message",
		delay: 3100,
		sender: SenderType.AI,
		content: "Did you wrap your app with the SupportProvider?",
		senderName: "AI Assistant",
	},
	{
		type: "message",
		delay: 2400,
		sender: SenderType.AI,
		content: "Let me get Anthony to help you with the setup.",
		senderName: "AI Assistant",
	},
	{
		type: "event",
		delay: 5000,
		eventType: "agent_joined",
		agentName: "Anthony",
	},
	{
		type: "message",
		delay: 5000,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Hey! You probably forgot to add SupportProvider in your root layout.tsx, Cossistant can you share the snippet?",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2200,
		sender: SenderType.AI,
		content: "Of course, here you go:",
		senderName: "Cossistant AI",
	},
	{
		type: "message",
		delay: 2200,
		sender: SenderType.AI,
		content: "```tsx\n<SupportProvider>\n  {children}\n</SupportProvider>```",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2800,
		sender: SenderType.VISITOR,
		content: "Oh that was it! Works perfectly now, thanks!",
	},
	{
		type: "message",
		delay: 2400,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Don't forget to use the correct public API key and everything should be ok!",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2400,
		sender: SenderType.TEAM_MEMBER,
		content: "Hope that helps, Can I help with anything else?",
		senderName: "Anthony",
	},
	{
		type: "event",
		delay: 10_000,
		eventType: "conversation_resolved",
	},
];

export interface UseDemoProps {
	enabled: boolean;
	defaultMessages: string[];
	onDemoMessage?: (message: Message) => void;
}

export interface ConversationEvent {
	id: string;
	event: string;
	timestamp?: Date;
	senderType?: SenderType;
	agentName?: string;
}

export interface UseDemoReturn {
	messages: Message[];
	events: ConversationEvent[];
	isTyping: boolean;
	currentTypingUser: SenderType | null;
	demoStarted: boolean;
	handleDemoResponse: (userMessage: string) => void;
}

export function useDemo({
	enabled,
	defaultMessages,
	onDemoMessage,
}: UseDemoProps): UseDemoReturn {
	const [messages, setMessages] = useState<Message[]>([]);
	const [events, setEvents] = useState<ConversationEvent[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [currentTypingUser, setCurrentTypingUser] = useState<SenderType | null>(
		null
	);
	const [demoStarted, setDemoStarted] = useState(false);

	// Initialize with default messages or start demo
	useEffect(() => {
		if (enabled && !demoStarted) {
			// Start demo sequence
			setDemoStarted(true);
			let cumulativeDelay = 0;

			demoSequence.forEach((step, index) => {
				cumulativeDelay += step.delay;

				if (step.type === "message") {
					// Show typing indicator before message (only for AI and TEAM_MEMBER)
					if (step.sender !== SenderType.VISITOR) {
						setTimeout(() => {
							setIsTyping(true);
							setCurrentTypingUser(step.sender);
						}, cumulativeDelay - 1500);
					}

					// Add message
					setTimeout(() => {
						const message: Message = {
							id: `demo-message-${index}`,
							content: step.content,
							timestamp: new Date(),
							sender: step.sender,
							conversationId: "demo",
						};
						setMessages((prev) => {
							const newMessages = [...prev, message];
							onDemoMessage?.(message);
							return newMessages;
						});
						// Only clear typing state if it was set for this message
						if (step.sender !== SenderType.VISITOR) {
							setIsTyping(false);
							setCurrentTypingUser(null);
						}
					}, cumulativeDelay);
				} else if (step.type === "event") {
					// Add event
					setTimeout(() => {
						let eventText = "";
						let senderType: SenderType = SenderType.AI; // Default
						let agentName: string | undefined;

						switch (step.eventType) {
							case "agent_joined":
								eventText = `${step.agentName} joined the conversation`;
								senderType = SenderType.TEAM_MEMBER;
								agentName = step.agentName;
								break;
							case "conversation_resolved":
								eventText = "Conversation automatically resolved";
								senderType = SenderType.AI;
								break;
							case "ai_analyzing":
								eventText = "AI is analyzing your request";
								senderType = SenderType.AI;
								break;
							case "ai_struggling":
								eventText = "Requesting human assistance";
								senderType = SenderType.AI;
								break;
							default:
								eventText = "Unknown event";
								senderType = SenderType.AI;
								break;
						}

						const event: ConversationEvent = {
							id: `demo-event-${index}`,
							event: eventText,
							timestamp: new Date(),
							senderType,
							agentName,
						};
						setEvents((prev) => [...prev, event]);
					}, cumulativeDelay);
				}
			});
		} else if (defaultMessages.length > 0 && !enabled) {
			const initialMessages: Message[] = defaultMessages.map((msg, index) => ({
				id: `default-${index}`,
				content: msg,
				timestamp: new Date(),
				sender: SenderType.TEAM_MEMBER,
				conversationId: "default",
			}));
			setMessages(initialMessages);
		}
	}, [enabled, demoStarted, defaultMessages, onDemoMessage]);

	const handleDemoResponse = (userMessage: string) => {
		if (!enabled) {
			return;
		}

		// In demo mode, just show a message that this is a demo
		const demoResponse: Message = {
			id: `demo-response-${Date.now()}`,
			content:
				"This is a demo mode. In a real implementation, your message would be sent to the support team.",
			timestamp: new Date(),
			sender: SenderType.AI,
			conversationId: "demo",
		};
		setMessages((prev) => {
			const newMessages = [...prev, demoResponse];
			onDemoMessage?.(demoResponse);
			return newMessages;
		});
	};

	return {
		messages,
		events,
		isTyping,
		currentTypingUser,
		demoStarted,
		handleDemoResponse,
	};
}
