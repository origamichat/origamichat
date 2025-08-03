import type { Message } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { useEffect, useState } from "react";

type EventType = "agent_joined" | "conversation_resolved" | "ai_analyzing";

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
		delay: 1000,
		sender: SenderType.VISITOR,
		content:
			"Hi! I just discovered Cossistant and I'm interested in adding it to my Next.js app. Can you tell me more about it?",
	},
	{
		type: "event",
		delay: 500,
		eventType: "ai_analyzing",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.AI,
		content:
			"Hello! Welcome to Cossistant. I'm the AI assistant here to help you get started. Cossistant is a developer-first support framework that combines AI and human expertise.",
		senderName: "Cossistant AI",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.AI,
		content:
			"With Cossistant, you get a ready-to-use <Support /> component that provides instant AI-powered support, with seamless handoff to human experts when needed. It's designed specifically for React and Next.js applications.",
		senderName: "Cossistant AI",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"That sounds amazing! How difficult is it to integrate? I'm using Next.js 14 with the app router.",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.AI,
		content:
			"Great choice! Cossistant works perfectly with Next.js 14 and the app router. The integration is surprisingly simple - you can have it running in under 5 minutes.",
		senderName: "Cossistant AI",
	},
	{
		type: "message",
		delay: 2500,
		sender: SenderType.AI,
		content:
			"Let me connect you with Anthony, our founder, who can walk you through the integration process and discuss early access to Cossistant.",
		senderName: "Cossistant AI",
	},
	{
		type: "event",
		delay: 1000,
		eventType: "agent_joined",
		agentName: "Anthony",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Hey there! I'm Anthony, founder of Cossistant. Thanks for your interest! I see you're using Next.js 14 - perfect timing as we've just optimized our components for the latest Next.js features.",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Here's how simple the integration is:\n\n1. Install the package: `npm install @cossistant/react`\n2. Add the Support component to your layout\n3. Configure your API key\n\nThat's it! The component handles all the complexity.",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"Wow, that's really straightforward! Does it support TypeScript? And can I customize the styling to match my brand?",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Absolutely! Cossistant is built with TypeScript from the ground up, so you get full type safety. For styling, you can either use our headless components for complete control, or customize our pre-built component with Tailwind classes.",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.AI,
		content:
			"I can add that we also support dark mode out of the box, and the component is fully responsive. It works great on mobile devices too!",
		senderName: "Cossistant AI",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.VISITOR,
		content:
			"This is exactly what I've been looking for! How can I get access?",
	},
	{
		type: "message",
		delay: 2500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"I'm glad you're excited! We're currently in early access. You can join our waitlist at cossistant.com/waitlist - we're onboarding new users every week.",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.TEAM_MEMBER,
		content:
			"As an early adopter, you'll get lifetime access to our Pro features and direct support from our team. We're also offering 50% off for our first 100 customers.",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.VISITOR,
		content:
			"That's an amazing offer! I'm signing up right now. Thanks for the help, both of you!",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Welcome to the Cossistant community! Feel free to reach out if you have any questions. We're here to make your support experience incredible. 🚀",
		senderName: "Anthony",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.AI,
		content:
			"I'll be here 24/7 to help you with the integration once you get access. Looking forward to seeing what you build!",
		senderName: "Cossistant AI",
	},
	{
		type: "event",
		delay: 1000,
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
						}, cumulativeDelay - 1000);
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
						switch (step.eventType) {
							case "agent_joined":
								eventText = `${step.agentName} joined the conversation`;
								break;
							case "conversation_resolved":
								eventText = "Conversation resolved by AI & Human collaboration";
								break;
							case "ai_analyzing":
								eventText = "AI agent analyzing request";
								break;
							default:
								eventText = "Unknown event";
								break;
						}

						const event: ConversationEvent = {
							id: `demo-event-${index}`,
							event: eventText,
							timestamp: new Date(),
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
