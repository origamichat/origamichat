"use client";

import "./support.css";

import type { Message } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { motion } from "motion/react";
import type React from "react";
import { useMemo, useState } from "react";
import { SupportConfig } from "../config";
import { useMultimodalInput } from "../hooks/use-multimodal-input";
import { useSupport } from "../provider";
import { Bubble, Window } from "./components";
import { SupportConfigProvider } from "./context/config";
import { NavigationProvider } from "./context/navigation";
import { useDemo } from "./hooks/use-demo";
import { SupportRouter } from "./router";
import { cn } from "./utils";

export interface SupportProps {
	className?: string;
	position?: "top" | "bottom";
	align?: "right" | "left";
	// Display the support widget in a floating window or in responsive mode (takes the full width / height of the parent)
	mode?: "floating" | "responsive";
	defaultMessages?: string[];
	quickOptions?: string[];
	showTypingIndicator?: boolean;
	conversationEvents?: { id: string; event: string; timestamp?: Date }[];
	demo?: boolean;
}

export const Support: React.FC<SupportProps> = ({
	className,
	position = "bottom",
	align = "right",
	mode = "floating",
	defaultMessages = [],
	quickOptions,
	conversationEvents = [],
	demo = false,
}) => {
	const [regularMessages, setRegularMessages] = useState<Message[]>([]);
	const [isTypingState, setIsTypingState] = useState<
		| {
				type: SenderType;
		  }
		| undefined
	>(undefined);

	const demoState = useDemo({
		enabled: demo,
		defaultMessages,
	});

	// UGLY, JUST FOR DEMO, WILL GO AWAY
	const messages = useMemo(
		() => (demo ? demoState.messages : regularMessages),
		[demo, demoState.messages, regularMessages]
	);
	const events = useMemo(
		() => (demo ? demoState.events : conversationEvents),
		[demo, demoState.events, conversationEvents]
	);
	const isTyping = useMemo(
		() =>
			demo
				? demoState.currentTypingUser
					? { type: demoState.currentTypingUser }
					: undefined
				: isTypingState,
		[demo, demoState.currentTypingUser, isTypingState]
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

			// Add user message
			const userMessage: Message = {
				id: `msg-${Date.now()}`,
				content: data.message,
				timestamp: new Date(),
				sender: SenderType.VISITOR,
				conversationId: "default",
			};
			setRegularMessages((prev) => [...prev, userMessage]);

			// Simulate typing
			setIsTypingState({ type: SenderType.AI });

			setTimeout(() => {
				// Add AI response
				const aiMessage: Message = {
					id: `msg-${Date.now() + 1}`,
					content:
						"Thanks for your message! This is a demo response, don't forget to join the waitlist to not miss the real stuff soon.",
					timestamp: new Date(),
					sender: SenderType.AI,
					conversationId: "default",
				};
				setRegularMessages((prev) => [...prev, aiMessage]);
				setIsTypingState(undefined);
			}, 3000);
		},
		onError: (_error) => {
			console.error("Multimodal input error:", _error);
		},
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
		<>
			<SupportConfigProvider mode={mode}>
				<NavigationProvider>
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
								events={events}
								files={files}
								isSubmitting={isSubmitting}
								isTyping={isTyping}
								message={message}
								messages={messages}
								removeFile={removeFile}
								setMessage={setMessage}
								submit={submit}
							/>
						</Window>
					</motion.div>
				</NavigationProvider>
			</SupportConfigProvider>
			<SupportConfig
				defaultMessages={defaultMessages}
				quickOptions={quickOptions}
			/>
		</>
	);
};

export default Support;

export { useSupportConfig } from "./context/config";

// Export navigation types and hooks for advanced usage
export {
	type NavigationState,
	type SUPPORT_PAGES,
	useSupportNavigation,
} from "./context/navigation";
