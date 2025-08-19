"use client";

import type { CossistantClient } from "@cossistant/core";
import type { ListConversationsResponse } from "@cossistant/types/api/conversation";
import type { PublicWebsiteResponse, SenderType } from "@cossistant/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useClient } from "./hooks/use-rest-client";
import { useConversations } from "./hooks/use-conversations";
import { useWebsiteData } from "./hooks/use-website-data";
import { WebSocketProvider } from "./support";

export interface CossistantProviderProps {
	children: React.ReactNode;
	defaultOpen?: boolean;
	apiUrl?: string;
	wsUrl?: string;
	publicKey?: string;
	defaultMessages?: DefaultMessage[];
	quickOptions?: string[];
	autoConnect?: boolean;
	onWsConnect?: () => void;
	onWsDisconnect?: () => void;
	onWsError?: (error: Error) => void;
	queryClient?: QueryClient;
}

export interface DefaultMessage {
	content: string;
	senderType: SenderType;
	senderId?: string;
}

export interface CossistantContextValue {
	website: PublicWebsiteResponse | null;
	conversations: ListConversationsResponse["conversations"] | null;
	conversationsLoading: boolean;
	conversationsError: Error | null;
	defaultMessages: DefaultMessage[];
	quickOptions: string[];
	setDefaultMessages: (messages: DefaultMessage[]) => void;
	setQuickOptions: (options: string[]) => void;
	unreadCount: number;
	setUnreadCount: (count: number) => void;
	isLoading: boolean;
	error: Error | null;
	client: CossistantClient | null;
	queryClient: QueryClient;
}

const SupportContext = React.createContext<CossistantContextValue | undefined>(
	undefined
);

function SupportProviderInner({
	children,
	apiUrl,
	wsUrl,
	publicKey,
	defaultMessages,
	quickOptions,
	autoConnect,
	onWsConnect,
	onWsDisconnect,
	onWsError,
	queryClient,
}: CossistantProviderProps & { queryClient: QueryClient }) {
	const [unreadCount, setUnreadCount] = React.useState(0);
	const [_defaultMessages, _setDefaultMessages] = React.useState<
		DefaultMessage[]
	>(defaultMessages || []);
	const [_quickOptions, _setQuickOptions] = React.useState<string[]>(
		quickOptions || []
	);
	const [isClientPrimed, setIsClientPrimed] = React.useState(false);

	// Update state when props change (for initial values from provider)
	React.useEffect(() => {
		if (defaultMessages && defaultMessages.length > 0) {
			_setDefaultMessages(defaultMessages);
		}
	}, [defaultMessages]);

	React.useEffect(() => {
		if (quickOptions && quickOptions.length > 0) {
			_setQuickOptions(quickOptions);
		}
	}, [quickOptions]);

	const { client, error: clientError } = useClient(publicKey, apiUrl, wsUrl);
	const { website, isLoading, error: websiteError } = useWebsiteData(client);
	const { 
		conversations, 
		isLoading: conversationsLoading, 
		error: conversationsError 
	} = useConversations(client, { 
		limit: 5, 
		enabled: !!website && !!website.visitor && isClientPrimed
	});

	const error = clientError || websiteError;

	// Prime REST client with website/visitor context so headers are sent reliably
	React.useEffect(() => {
		if (client && website) {
			// @ts-expect-error internal priming: safe in our library context
			client.restClient?.setWebsiteContext?.(website.id, website.visitor?.id);
			setIsClientPrimed(true);
		} else {
			setIsClientPrimed(false);
		}
	}, [client, website]);

	const setDefaultMessages = React.useCallback(
		(messages: DefaultMessage[]) => _setDefaultMessages(messages),
		[]
	);

	const setQuickOptions = React.useCallback(
		(options: string[]) => _setQuickOptions(options),
		[]
	);

	const setUnreadCountStable = React.useCallback(
		(count: number) => setUnreadCount(count),
		[]
	);

	const value = React.useMemo<CossistantContextValue>(
		() => ({
			website,
			conversations,
			conversationsLoading,
			conversationsError,
			unreadCount,
			setUnreadCount: setUnreadCountStable,
			isLoading,
			error,
			client,
			defaultMessages: _defaultMessages,
			setDefaultMessages,
			quickOptions: _quickOptions,
			setQuickOptions,
			queryClient,
		}),
		[
			website,
			conversations,
			conversationsLoading,
			conversationsError,
			unreadCount,
			isLoading,
			error,
			client,
			_defaultMessages,
			_quickOptions,
			queryClient,
			setDefaultMessages,
			setQuickOptions,
			setUnreadCountStable,
		]
	);

	return (
		<SupportContext.Provider value={value}>
			<WebSocketProvider
				autoConnect={autoConnect}
				onConnect={onWsConnect}
				onDisconnect={onWsDisconnect}
				onError={onWsError}
				publicKey={publicKey}
				wsUrl={wsUrl}
			>
				{children}
			</WebSocketProvider>
		</SupportContext.Provider>
	);
}

export function SupportProvider({
	children,
	apiUrl = "https://api.cossistant.com/v1",
	wsUrl = "wss://api.cossistant.com/ws",
	publicKey,
	defaultMessages,
	quickOptions,
	autoConnect = true,
	onWsConnect,
	onWsDisconnect,
	onWsError,
	queryClient,
}: CossistantProviderProps) {
	// Create a default QueryClient if none provided
	const [defaultQueryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000, // 5 minutes
						gcTime: 10 * 60 * 1000, // 10 minutes
					},
				},
			})
	);

	const activeQueryClient = queryClient || defaultQueryClient;

	return (
		<QueryClientProvider client={activeQueryClient}>
			<SupportProviderInner
				apiUrl={apiUrl}
				autoConnect={autoConnect}
				defaultMessages={defaultMessages}
				onWsConnect={onWsConnect}
				onWsDisconnect={onWsDisconnect}
				onWsError={onWsError}
				publicKey={publicKey}
				queryClient={activeQueryClient}
				quickOptions={quickOptions}
				wsUrl={wsUrl}
			>
				{children}
			</SupportProviderInner>
		</QueryClientProvider>
	);
}

export function useSupport() {
	const context = React.useContext(SupportContext);
	if (!context) {
		throw new Error(
			"useSupport must be used within a cossistant SupportProvider"
		);
	}

	const availableHumanAgents = context.website?.availableHumanAgents || [];
	const availableAIAgents = context.website?.availableAIAgents || [];

	return {
		...context,
		availableHumanAgents,
		availableAIAgents,
		visitor: context.website?.visitor,
	};
}
