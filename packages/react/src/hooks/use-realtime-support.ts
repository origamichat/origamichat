"use client";

import {
	CossistantWebSocketClient,
	type CossistantWebSocketConfig,
	type WebSocketEventHandlers,
} from "@cossistant/core";
import type { RealtimeEvent } from "@cossistant/types/realtime-events";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseRealtimeSupportOptions {
	publicKey?: string;
	wsUrl?: string;
	userId?: string;
	organizationId?: string;
	autoConnect?: boolean;
	onEvent?: (event: RealtimeEvent) => void;
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: Error) => void;
}

export interface UseRealtimeSupportResult {
	isConnected: boolean;
	isConnecting: boolean;
	error: Error | null;
	connect: () => Promise<void>;
	disconnect: () => void;
	send: (event: RealtimeEvent) => void;
}

const DEFAULT_WS_URL = "wss://api.cossistant.com/ws";

export function useRealtimeSupport(
	options: UseRealtimeSupportOptions = {}
): UseRealtimeSupportResult {
	const {
		publicKey,
		wsUrl = DEFAULT_WS_URL,
		userId,
		organizationId,
		autoConnect = true,
		onEvent,
		onConnect,
		onDisconnect,
		onError,
	} = options;

	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const clientRef = useRef<CossistantWebSocketClient | null>(null);

	const getPublicKey = useCallback(() => {
		let keyToUse = publicKey;

		if (!keyToUse) {
			const envKey =
				(typeof window !== "undefined" &&
					window.process?.env?.NEXT_PUBLIC_COSSISSTANT_KEY) ||
				(typeof window !== "undefined" &&
					window.process?.env?.COSSISSTANT_PUBLIC_KEY) ||
				process.env.NEXT_PUBLIC_COSSISSTANT_KEY ||
				process.env.COSSISSTANT_PUBLIC_KEY;

			if (!envKey) {
				throw new Error(
					"Public key is required. Please provide it as a prop or set NEXT_PUBLIC_COSSISSTANT_KEY environment variable."
				);
			}
			keyToUse = envKey;
		}

		return keyToUse;
	}, [publicKey]);

	const connect = useCallback(async () => {
		if (clientRef.current?.isConnected() || isConnecting) {
			return;
		}

		setIsConnecting(true);
		setError(null);

		try {
			const key = getPublicKey();

			if (!clientRef.current) {
				const config: CossistantWebSocketConfig = {
					wsUrl,
					publicKey: key,
					userId,
					organizationId,
				};

				clientRef.current = new CossistantWebSocketClient(config);

				const handlers: WebSocketEventHandlers = {
					onConnect: () => {
						setIsConnected(true);
						setIsConnecting(false);
						onConnect?.();
					},
					onDisconnect: () => {
						setIsConnected(false);
						setIsConnecting(false);
						onDisconnect?.();
					},
					onError: (err) => {
						setError(err);
						setIsConnecting(false);
						onError?.(err);
					},
					onEvent: (event) => {
						onEvent?.(event);
					},
				};

				clientRef.current.on("onConnect", handlers.onConnect);
				clientRef.current.on("onDisconnect", handlers.onDisconnect);
				clientRef.current.on("onError", handlers.onError);
				clientRef.current.on("onEvent", handlers.onEvent);
			}

			await clientRef.current.connect();
		} catch (err) {
			const errorObj =
				err instanceof Error
					? err
					: new Error("Failed to connect to WebSocket");
			setError(errorObj);
			setIsConnecting(false);
			onError?.(errorObj);
		}
	}, [
		wsUrl,
		userId,
		organizationId,
		isConnecting,
		getPublicKey,
		onConnect,
		onDisconnect,
		onError,
		onEvent,
	]);

	const disconnect = useCallback(() => {
		if (clientRef.current) {
			clientRef.current.disconnect();
			setIsConnected(false);
		}
	}, []);

	const send = useCallback((event: RealtimeEvent) => {
		if (!clientRef.current?.isConnected()) {
			throw new Error("WebSocket is not connected");
		}
		clientRef.current.send(event);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: ok
	useEffect(() => {
		if (autoConnect) {
			connect();
		}

		return () => {
			if (clientRef.current?.isConnected()) {
				clientRef.current.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		if (clientRef.current && (userId || organizationId)) {
			const config: Partial<CossistantWebSocketConfig> = {};
			if (userId) {
				config.userId = userId;
			}

			if (organizationId) {
				config.organizationId = organizationId;
			}
			clientRef.current.updateConfiguration(config);
		}
	}, [userId, organizationId]);

	return {
		isConnected,
		isConnecting,
		error,
		connect,
		disconnect,
		send,
	};
}
