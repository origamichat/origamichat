import type { Message } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { useEffect, useState } from "react";

const demoSequence = [
	{
		delay: 1000,
		sender: SenderType.VISITOR,
		content:
			"Hi, I'm having trouble integrating the payment system. The webhooks don't seem to be working properly.",
	},
	{
		delay: 2000,
		sender: SenderType.AI,
		content:
			"I understand you're having issues with payment webhook integration. Let me help you troubleshoot this.",
	},
	{
		delay: 2500,
		sender: SenderType.AI,
		content:
			"Can you tell me which payment provider you're using and if you're seeing any error messages in your logs?",
	},
	{
		delay: 3000,
		sender: SenderType.VISITOR,
		content:
			"I'm using Stripe, and I'm getting 400 errors when the webhook fires. The signature validation seems to be failing.",
	},
	{
		delay: 2000,
		sender: SenderType.AI,
		content:
			"Webhook signature validation errors are common. Let me check our documentation for the proper setup...",
	},
	{
		delay: 3000,
		sender: SenderType.AI,
		content:
			"I see this might be related to the webhook secret configuration. Let me get a human expert to help you with the specific Stripe integration details.",
	},
	{
		delay: 2000,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Hi! I'm Sarah from the technical team. I see you're having Stripe webhook validation issues.",
	},
	{
		delay: 2500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"The most common cause is using the wrong webhook secret. Make sure you're using the webhook endpoint secret from your Stripe dashboard, not the API key.",
	},
	{
		delay: 3000,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Also, ensure you're getting the raw request body for signature validation. Some frameworks parse it automatically which breaks the validation.",
	},
	{
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"Oh, that might be it! I think my framework is parsing the body. How do I get the raw body?",
	},
	{
		delay: 2500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"Which framework are you using? I can give you the specific code snippet.",
	},
	{
		delay: 1500,
		sender: SenderType.VISITOR,
		content: "I'm using Express.js",
	},
	{
		delay: 3000,
		sender: SenderType.TEAM_MEMBER,
		content:
			// biome-ignore lint/suspicious/noTemplateCurlyInString: ok
			"Perfect! For Express, you need to get the raw body before any middleware parses it. Here's what you need:\n\n```javascript\napp.post('/webhook', \n  express.raw({type: 'application/json'}),\n  (req, res) => {\n    const sig = req.headers['stripe-signature'];\n    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;\n    \n    try {\n      const event = stripe.webhooks.constructEvent(\n        req.body, // raw body\n        sig,\n        webhookSecret\n      );\n      // Handle the event\n    } catch (err) {\n      console.error('Webhook signature verification failed');\n      return res.status(400).send(`Webhook Error: ${err.message}`);\n    }\n  }\n);\n```",
	},
	{
		delay: 2000,
		sender: SenderType.VISITOR,
		content:
			"Thank you so much! That's exactly what I needed. I'll try this right away.",
	},
	{
		delay: 1500,
		sender: SenderType.TEAM_MEMBER,
		content:
			"You're welcome! Feel free to reach out if you need any more help. Good luck with your integration! 🚀",
	},
];

export interface UseDemoProps {
	enabled: boolean;
	defaultMessages: string[];
	onDemoMessage?: (message: Message) => void;
}

export interface UseDemoReturn {
	messages: Message[];
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

				// Show typing indicator before message
				setTimeout(() => {
					setIsTyping(true);
					setCurrentTypingUser(step.sender);
				}, cumulativeDelay - 1000);

				// Add message
				setTimeout(() => {
					const message: Message = {
						id: `demo-${index}`,
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
		isTyping,
		currentTypingUser,
		demoStarted,
		handleDemoResponse,
	};
}
