"use client";

import "./support.css";

import type React from "react";
import { SupportConfig } from "../config";
import { SupportContent } from "./components/support-content";
import { SupportConfigProvider } from "./context/config";

export interface SupportProps {
	className?: string;
	position?: "top" | "bottom";
	align?: "right" | "left";
	// Display the support widget in a floating window or in responsive mode (takes the full width / height of the parent)
	mode?: "floating" | "responsive";
	quickOptions?: string[];
	defaultMessages?: string[];
	defaultOpen?: boolean;
}

// Internal component that needs the conversation context
export function Support({
	className,
	position = "bottom",
	align = "right",
	mode = "floating",
	quickOptions,
	defaultMessages,
	defaultOpen,
}: SupportProps) {
	return (
		<>
			<SupportConfigProvider defaultOpen={defaultOpen} mode={mode}>
				<SupportContent
					align={align}
					className={className}
					mode={mode}
					position={position}
				/>
			</SupportConfigProvider>
			<SupportConfig
				defaultMessages={defaultMessages}
				quickOptions={quickOptions}
			/>
		</>
	);
}

export default Support;

export { useSupportConfig } from "./context/config";
export type { WebSocketContextValue } from "./context/websocket";
export { useWebSocket, WebSocketProvider } from "./context/websocket";

// Export the store for direct access if needed
export { useSupportStore } from "./store";
