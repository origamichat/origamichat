"use client";

import type { WebsiteResponse } from "@cossistant/types";
import * as React from "react";

export interface CossistantProviderProps {
	children: React.ReactNode;
	defaultOpen?: boolean;
}

export interface CossistantContextValue {
	website: WebsiteResponse | null;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	unreadCount: number;
	setUnreadCount: (count: number) => void;
}

const SupportContext = React.createContext<CossistantContextValue | undefined>(
	undefined
);

export function SupportProvider({
	children,
	defaultOpen = false,
}: CossistantProviderProps) {
	const [isOpen, setIsOpen] = React.useState(defaultOpen);
	const [unreadCount, setUnreadCount] = React.useState(0);

	const open = React.useCallback(() => setIsOpen(true), []);
	const close = React.useCallback(() => setIsOpen(false), []);
	const toggle = React.useCallback(() => setIsOpen((o) => !o), []);

	const website = null as WebsiteResponse | null;

	const value = React.useMemo<CossistantContextValue>(
		() => ({
			website,
			isOpen,
			open,
			close,
			toggle,
			unreadCount,
			setUnreadCount,
		}),
		[website, isOpen, open, close, toggle, unreadCount]
	);

	return (
		<SupportContext.Provider value={value}>{children}</SupportContext.Provider>
	);
}

export function useSupport() {
	const context = React.useContext(SupportContext);
	if (!context) {
		throw new Error(
			"useSupport must be used within a cossistant SupportProvider"
		);
	}
	return context;
}
