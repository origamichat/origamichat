"use client";

import type { RealtimeEvent } from "@cossistant/types/realtime-events";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import useWebSocketLib, { ReadyState } from "react-use-websocket";
import { useConversationActions } from "../../store";

export interface WebSocketContextValue {
	isConnected: boolean;
	isConnecting: boolean;
	error: Error | null;
	send: (event: RealtimeEvent) => void;
	subscribe: (handler: (event: RealtimeEvent) => void) => () => void;
	lastMessage: RealtimeEvent | null;
}

interface WebSocketProviderProps {
	children: React.ReactNode;
	publicKey?: string;
	wsUrl?: string;
	autoConnect?: boolean;
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: Error) => void;
}

const DEFAULT_WS_URL = "wss://api.cossistant.com/ws";

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
	publicKey,
	wsUrl = DEFAULT_WS_URL,
	autoConnect = true,
	onConnect,
	onDisconnect,
	onError,
}) => {
	const eventHandlersRef = useRef<Set<(event: RealtimeEvent) => void>>(
		new Set()
	);
	const lastMessageRef = useRef<RealtimeEvent | null>(null);
	const { handleRealtimeEvent } = useConversationActions();

	const getOptionalPublicKey = useCallback(() => {
		const keyFromProps = publicKey?.trim();
		if (keyFromProps) {
			return keyFromProps;
		}

		const envKey =
			process.env.NEXT_PUBLIC_COSSISSTANT_KEY ||
			process.env.COSSISSTANT_PUBLIC_KEY;
		const trimmed = envKey?.trim();
		return trimmed && trimmed.length > 0 ? trimmed : null;
	}, [publicKey]);

	// Build the WebSocket URL with query parameters
	const socketUrl = useMemo(() => {
		if (!autoConnect) {
			return null;
		}

		try {
			const url = new URL(wsUrl);
			const key = getOptionalPublicKey();
			if (key) {
				url.searchParams.set("publicKey", key);
			}

			return url.toString();
		} catch (err) {
			onError?.(
				err instanceof Error ? err : new Error("Failed to build WebSocket URL")
			);
			return null;
		}
	}, [wsUrl, autoConnect, getOptionalPublicKey, onError]);

	const [connectionError, setConnectionError] = useState<Error | null>(null);

	const { sendMessage, lastMessage, readyState } = useWebSocketLib(socketUrl, {
		shouldReconnect: () => true,
		reconnectAttempts: 10,
		reconnectInterval: 3000,
		onOpen: () => {
			setConnectionError(null);
			onConnect?.();
		},
		onClose: () => {
			onDisconnect?.();
		},
		onError: (event) => {
			const err = new Error(`WebSocket error: ${event.type}`);
			setConnectionError(err);
			onError?.(err);
		},
	});

	// Parse and distribute messages to subscribers
	useEffect(() => {
		if (lastMessage !== null) {
			try {
				const event = JSON.parse(lastMessage.data) as RealtimeEvent;
				lastMessageRef.current = event;

				// Update the store with the event
				handleRealtimeEvent(event);

				// Notify all subscribed handlers
				for (const handler of eventHandlersRef.current) {
					handler(event);
				}
			} catch {
				// Intentionally swallow to avoid console noise in production builds
			}
		}
	}, [lastMessage, handleRealtimeEvent]);

	const send = useCallback(
		(event: RealtimeEvent) => {
			if (readyState !== ReadyState.OPEN) {
				throw new Error("WebSocket is not connected");
			}
			sendMessage(JSON.stringify(event));
		},
		[sendMessage, readyState]
	);

	const subscribe = useCallback((handler: (event: RealtimeEvent) => void) => {
		eventHandlersRef.current.add(handler);
		return () => {
			eventHandlersRef.current.delete(handler);
		};
	}, []);

	const value: WebSocketContextValue = useMemo(
		() => ({
			isConnected: readyState === ReadyState.OPEN,
			isConnecting: readyState === ReadyState.CONNECTING,
			error: connectionError,
			send,
			subscribe,
			lastMessage: lastMessageRef.current,
		}),
		[readyState, send, subscribe, connectionError]
	);

	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = (): WebSocketContextValue => {
	const context = useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within WebSocketProvider");
	}
	return context;
};
