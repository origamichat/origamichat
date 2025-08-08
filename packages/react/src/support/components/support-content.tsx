"use client";

import type { Message } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { motion } from "motion/react";
import type React from "react";
import { useMemo } from "react";
import { useMultimodalInput } from "../../hooks/use-multimodal-input";
import {
	useActiveMessages,
	useActiveTypingIndicator,
	useConversationActions,
	useConversationState,
} from "../../store";
import { useWebSocket } from "../context/websocket";
import { useDemo } from "../hooks/use-demo";
import { SupportRouter } from "../router";
import { cn } from "../utils";
import { Bubble } from "./bubble";
import { Window } from "./window";

interface SupportContentProps {
	className?: string;
	position?: "top" | "bottom";
	align?: "right" | "left";
	mode?: "floating" | "responsive";
	defaultMessages?: string[];
	demo?: boolean;
}

export const SupportContent: React.FC<SupportContentProps> = ({
	className,
	position = "bottom",
	align = "right",
	mode = "floating",
	defaultMessages = [],
	demo = false,
}) => {
	// Store hooks
	const messages = useActiveMessages();
	const typingIndicator = useActiveTypingIndicator();
	const { activeConversationId, events: eventsMap } = useConversationState();
	const { addMessage, setTypingIndicator } = useConversationActions();
	const events = activeConversationId
		? eventsMap.get(activeConversationId) || []
		: [];

	// WebSocket hook
	const { isConnected } = useWebSocket();

	// Demo state
	const demoState = useDemo({
		enabled: demo,
		defaultMessages,
	});

	// Determine which messages and events to show
	const displayMessages = useMemo(
		() => (demo ? demoState.messages : messages),
		[demo, demoState.messages, messages]
	);

	const displayEvents = useMemo(
		() => (demo ? demoState.events : events),
		[demo, demoState.events, events]
	);

	const _displayTyping = useMemo(
		() =>
			demo
				? demoState.currentTypingUser
					? { type: demoState.currentTypingUser }
					: undefined
				: typingIndicator,
		[demo, demoState.currentTypingUser, typingIndicator]
	);

	const {
		message,
		files,
		isSubmitting,
		error,
		setMessage,
		addFiles,
		removeFile,
		submit,
	} = useMultimodalInput({
		onSubmit: async (data) => {
			if (demo) {
				demoState.handleDemoResponse(data.message);
				return;
			}

			// Get or create conversation ID
			const conversationId = activeConversationId || `conv-${Date.now()}`;

			// Add user message to store
			const userMessage: Message = {
				id: `msg-${Date.now()}`,
				content: data.message,
				timestamp: new Date(),
				sender: SenderType.VISITOR,
				conversationId,
			};
			addMessage(conversationId, userMessage);

			// Send via WebSocket if connected
			if (isConnected) {
				// Set typing indicator for AI
				setTypingIndicator(conversationId, {
					conversationId,
					type: SenderType.AI,
					timestamp: new Date(),
				});
			} else {
				// Fallback simulation when not connected
				setTypingIndicator(conversationId, {
					conversationId,
					type: SenderType.AI,
					timestamp: new Date(),
				});

				setTimeout(() => {
					const aiMessage: Message = {
						id: `msg-${Date.now() + 1}`,
						content:
							"Thanks for your message! This is a demo response. WebSocket is not connected.",
						timestamp: new Date(),
						sender: SenderType.AI,
						conversationId,
					};
					addMessage(conversationId, aiMessage);
					setTypingIndicator(conversationId, null);
				}, 3000);
			}
		},
		onError: () => {},
	});

	const containerClasses = cn(
		"cossistant",
		{
			// Floating mode positioning
			"fixed z-[9999]": mode === "floating",
			"bottom-4": mode === "floating" && position === "bottom",
			"top-4": mode === "floating" && position === "top",
			"right-4": mode === "floating" && align === "right",
			"left-4": mode === "floating" && align === "left",
			// Responsive mode
			"relative h-full w-full": mode === "responsive",
		},
		className
	);

	const windowClasses = cn({
		// Floating mode window positioning
		"absolute z-[9999]": mode === "floating",
		"bottom-16": mode === "floating" && position === "bottom",
		"top-16": mode === "floating" && position === "top",
		"right-0": mode === "floating" && align === "right",
		"left-0": mode === "floating" && align === "left",
		// Responsive mode window
		"relative h-full w-full rounded-none border-0 shadow-none":
			mode === "responsive",
	});

	return (
		<motion.div
			className={containerClasses}
			layout="position"
			transition={{
				default: { ease: "anticipate" },
				layout: { duration: 0.3 },
			}}
		>
			{mode === "floating" && <Bubble />}
			<Window className={windowClasses}>
				<SupportRouter
					addFiles={addFiles}
					error={error}
					events={displayEvents}
					files={files}
					isSubmitting={isSubmitting}
					message={message}
					messages={displayMessages}
					removeFile={removeFile}
					setMessage={setMessage}
					submit={submit}
				/>
			</Window>
		</motion.div>
	);
};
