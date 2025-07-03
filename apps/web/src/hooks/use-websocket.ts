"use client";

import type { ClientMessage, ServerMessage } from "@api/ws/schema";
import { serverMessageSchema } from "@api/ws/schema";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { getWebSocketUrl } from "@/lib/url";

export function usePingWebSocket() {
	const { sendJsonMessage, lastJsonMessage, readyState } =
		useWebSocket<ServerMessage>(getWebSocketUrl(), {
			shouldReconnect: () => true,
		});

	useEffect(() => {
		if (readyState === ReadyState.OPEN) {
			const msg: ClientMessage = { type: "ping" };
			sendJsonMessage(msg);
		}
	}, [readyState, sendJsonMessage]);

	useEffect(() => {
		if (!lastJsonMessage) {
			return;
		}
		const parsed = serverMessageSchema.safeParse(lastJsonMessage);
		if (parsed.success && parsed.data.type === "pong") {
			console.log("Received pong from server");
		}
	}, [lastJsonMessage]);

	return { readyState };
}
