"use client";

import type { RealtimeEvent } from "@cossistant/types/realtime-events";
import { useEffect } from "react";
import { useWebSocket } from "../support/context/websocket";

export interface UseRealtimeSupportOptions {
	onEvent?: (event: RealtimeEvent) => void;
}

export interface UseRealtimeSupportResult {
	isConnected: boolean;
	isConnecting: boolean;
	error: Error | null;
	send: (event: RealtimeEvent) => void;
	lastMessage: RealtimeEvent | null;
}

export function useRealtimeSupport(
	options: UseRealtimeSupportOptions = {}
): UseRealtimeSupportResult {
	const { onEvent } = options;
	const { isConnected, isConnecting, error, send, subscribe, lastMessage } =
		useWebSocket();

	// Subscribe to WebSocket events
	useEffect(() => {
		if (onEvent) {
			const unsubscribe = subscribe(onEvent);
			return unsubscribe;
		}
	}, [onEvent, subscribe]);

	return {
		isConnected,
		isConnecting,
		error,
		send,
		lastMessage,
	};
}
