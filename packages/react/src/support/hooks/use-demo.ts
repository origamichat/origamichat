import type { Message } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { useEffect, useState } from "react";

type DemoStep =
	| { type: "message"; delay: number; sender: SenderType; content: string }
	| { type: "event"; delay: number; event: string };

const demoSequence: DemoStep[] = [
	{
		type: "message",
		delay: 1000,
		sender: SenderType.VISITOR,
		content:
			"Hi, I'm having trouble integrating the payment system. The webhooks don't seem to be working properly.",
	},
	{
		type: "event",
		delay: 500,
		event: "AI agent analyzing issue",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.AI,
		content:
			"Hello! I'm Cossistant AI, and I'm here to help you with your payment integration issue. I see you're experiencing problems with webhooks.",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.AI,
		content:
			"Let me analyze this for you. Webhook issues are often related to configuration or signature validation. Can you tell me which payment provider you're using?",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"I'm using Stripe, and I'm getting 400 errors when the webhook fires. The signature validation seems to be failing.",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.AI,
		content:
			"I see the issue. Stripe webhook signature validation failures typically occur when the raw request body is modified before validation. Let me check our knowledge base...",
	},
	{
		type: "message",
		delay: 2500,
		sender: SenderType.AI,
		content:
			"Based on your error, this is likely a framework-specific issue. However, for the best assistance with your specific setup, I'll connect you with Sarah from our technical team who specializes in Stripe integrations.",
	},
	{
		type: "event",
		delay: 1000,
		event: "Sarah joined the conversation",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Hi! I'm Sarah from the technical team. Thanks for the detailed context, AI. I can definitely help with your Stripe webhook validation issue.",
	},
	{
		type: "message",
		delay: 2500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"The AI is correct - this is usually about raw body handling. First, make sure you're using the webhook endpoint secret from your Stripe dashboard, not the API key.",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"Yes, I'm using the webhook secret. But I think my framework might be parsing the body automatically.",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"That's exactly the issue! Which framework are you using? I can provide the specific code to handle the raw body correctly.",
	},
	{
		type: "message",
		delay: 1000,
		sender: SenderType.VISITOR,
		content: "I'm using Express.js",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.AI,
		content:
			"I can help with that! For Express.js, you need to capture the raw body before any JSON parsing middleware. Sarah, shall I share the code snippet?",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content: "Please do! The AI has the right solution for this.",
	},
	{
		type: "message",
		delay: 2500,
		sender: SenderType.AI,
		content:
			// biome-ignore lint/suspicious/noTemplateCurlyInString: ok
			"Here's the Express.js configuration you need:\n\n```javascript\napp.post('/webhook', \n  express.raw({type: 'application/json'}),\n  (req, res) => {\n    const sig = req.headers['stripe-signature'];\n    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;\n    \n    try {\n      const event = stripe.webhooks.constructEvent(\n        req.body, // raw body\n        sig,\n        webhookSecret\n      );\n      // Handle the event\n    } catch (err) {\n      console.error('Webhook signature verification failed');\n      return res.status(400).send(`Webhook Error: ${err.message}`);\n    }\n  }\n);\n```",
	},
	{
		type: "message",
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"Wow, this is perfect! Thank you both - the AI for the quick diagnosis and Sarah for confirming the solution.",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Great teamwork! That's exactly how Cossistant works - AI provides instant support and we humans jump in when needed. Feel free to reach out if you have any issues implementing this.",
	},
	{
		type: "message",
		delay: 1500,
		sender: SenderType.AI,
		content:
			"I'll be here 24/7 if you need any follow-up assistance. Good luck with your integration! 🚀",
	},
	{
		type: "event",
		delay: 1000,
		event: "Conversation resolved by AI & Human collaboration",
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
					// Show typing indicator before message
					setTimeout(() => {
						setIsTyping(true);
						setCurrentTypingUser(step.sender);
					}, cumulativeDelay - 1000);

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
						setIsTyping(false);
						setCurrentTypingUser(null);
					}, cumulativeDelay);
				} else if (step.type === "event") {
					// Add event
					setTimeout(() => {
						const event: ConversationEvent = {
							id: `demo-event-${index}`,
							event: step.event,
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
