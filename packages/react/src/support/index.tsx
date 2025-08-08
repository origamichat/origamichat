"use client";

import "./support.css";

import { ConversationStatus } from "@cossistant/types";
import type React from "react";
import { useEffect } from "react";
import { SupportConfig } from "../config";
import { useConversationActions, useConversationState } from "../store";
import { SupportContent } from "./components/support-content";
import { SupportConfigProvider } from "./context/config";
import { NavigationProvider } from "./context/navigation";

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
	// WebSocket configuration
	publicKey?: string;
	wsUrl?: string;
	userId?: string;
	organizationId?: string;
	autoConnect?: boolean;
	onWsConnect?: () => void;
	onWsDisconnect?: () => void;
	onWsError?: (error: Error) => void;
}

// Internal component that needs the conversation context
export function Support({
	className,
	position = "bottom",
	align = "right",
	mode = "floating",
	defaultMessages = [],
	quickOptions,
	demo = false,
}: SupportProps) {
	// Initialize default conversation if needed
	const state = useConversationState();
	const { addConversation, setActiveConversation } = useConversationActions();

	useEffect(() => {
		// Create default conversation if none exists
		if (!(state.activeConversationId || demo)) {
			const defaultConversation = {
				id: `conv-${Date.now()}`,
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: "user-1",
				status: ConversationStatus.OPEN,
				unreadCount: 0,
			};
			addConversation(defaultConversation);
			setActiveConversation(defaultConversation.id);
		}
	}, [
		state.activeConversationId,
		demo,
		addConversation,
		setActiveConversation,
	]);

	return (
		<>
			<SupportConfigProvider mode={mode}>
				<NavigationProvider>
					<SupportContent
						align={align}
						className={className}
						defaultMessages={defaultMessages}
						demo={demo}
						mode={mode}
						position={position}
					/>
				</NavigationProvider>
			</SupportConfigProvider>
			<SupportConfig
				defaultMessages={defaultMessages}
				quickOptions={quickOptions}
			/>
		</>
	);
}

export default Support;

export type {
	ConversationEvent,
	ConversationState,
	TypingIndicator,
} from "../store";
// Export store hooks and context
export {
	ConversationProvider,
	useActiveConversation,
	useActiveMessages,
	useActiveTypingIndicator,
	useAllConversations,
	useConversationActions,
	useConversationById,
	useConversationDispatch,
	useConversationMessages,
	useConversationState,
} from "../store";
export { useSupportConfig } from "./context/config";
// Export navigation types and hooks for advanced usage
export {
	type NavigationState,
	type SUPPORT_PAGES,
	useSupportNavigation,
} from "./context/navigation";
export type { WebSocketContextValue } from "./context/websocket";
// Export WebSocket context and hook for realtime features
export { useWebSocket, WebSocketProvider } from "./context/websocket";
