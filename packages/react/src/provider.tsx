"use client";

import type { CossistantRestClient } from "@cossistant/core";
import type { PublicWebsiteResponse } from "@cossistant/types";
import * as React from "react";
import { useClient } from "./hooks/use-rest-client";
import { useWebsiteData } from "./hooks/use-website-data";

export interface CossistantProviderProps {
	children: React.ReactNode;
	defaultOpen?: boolean;
	apiUrl?: string;
	wsUrl?: string;
	publicKey?: string;
	defaultMessages?: string[];
	quickOptions?: string[];
}

export interface CossistantContextValue {
	website: PublicWebsiteResponse | null;
	defaultMessages: string[];
	quickOptions: string[];
	setDefaultMessages: (messages: string[]) => void;
	setQuickOptions: (options: string[]) => void;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
	unreadCount: number;
	setUnreadCount: (count: number) => void;
	isLoading: boolean;
	error: Error | null;
	client: CossistantRestClient | null;
}

const SupportContext = React.createContext<CossistantContextValue | undefined>(
	undefined
);

export function SupportProvider({
	children,
	defaultOpen = false,
	apiUrl = "https://api.cossistant.com/v1",
	wsUrl = "wss://api.cossistant.com",
	publicKey,
	defaultMessages,
	quickOptions,
}: CossistantProviderProps) {
	const [isOpen, setIsOpen] = React.useState(defaultOpen);
	const [unreadCount, setUnreadCount] = React.useState(0);
	const [_defaultMessages, _setDefaultMessages] = React.useState(
		defaultMessages || []
	);
	const [_quickOptions, _setQuickOptions] = React.useState(quickOptions || []);

	const open = React.useCallback(() => setIsOpen(true), []);
	const close = React.useCallback(() => setIsOpen(false), []);
	const toggle = React.useCallback(() => setIsOpen((o) => !o), []);

	const { client, error: clientError } = useClient(publicKey, apiUrl, wsUrl);
	const { website, isLoading, error: websiteError } = useWebsiteData(client);

	const error = clientError || websiteError;

	const value = React.useMemo<CossistantContextValue>(
		() => ({
			website,
			isOpen,
			open,
			close,
			toggle,
			unreadCount,
			setUnreadCount,
			isLoading,
			error,
			client,
			defaultMessages: _defaultMessages,
			setDefaultMessages: _setDefaultMessages,
			quickOptions: _quickOptions,
			setQuickOptions: _setQuickOptions,
		}),
		[
			website,
			isOpen,
			unreadCount,
			isLoading,
			error,
			client,
			open,
			close,
			_defaultMessages,
			_quickOptions,
			toggle,
		]
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
