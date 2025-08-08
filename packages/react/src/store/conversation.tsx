"use client";

import type {
	Agent,
	Conversation,
	Message,
	SenderType,
} from "@cossistant/types";
import type { RealtimeEvent } from "@cossistant/types/realtime-events";
import React, {
	createContext,
	type ReactNode,
	useContext,
	useReducer,
} from "react";

export interface ConversationEvent {
	id: string;
	event: string;
	timestamp: Date;
	conversationId?: string;
}

export interface TypingIndicator {
	conversationId: string;
	type: SenderType;
	timestamp: Date;
}

export interface ConversationState {
	// Core data
	conversations: Map<string, Conversation>;
	messages: Map<string, Message[]>;
	events: Map<string, ConversationEvent[]>;
	typingIndicators: Map<string, TypingIndicator>;

	// Active state
	activeConversationId: string | null;

	// UI state
	isLoading: boolean;
	error: Error | null;

	// Available agents
	availableAgents: Agent[];
}

// Action types
export type ConversationAction =
	| {
			type: "ADD_MESSAGE";
			payload: { conversationId: string; message: Message };
	  }
	| {
			type: "UPDATE_MESSAGE";
			payload: {
				conversationId: string;
				messageId: string;
				updates: Partial<Message>;
			};
	  }
	| {
			type: "DELETE_MESSAGE";
			payload: { conversationId: string; messageId: string };
	  }
	| { type: "ADD_CONVERSATION"; payload: { conversation: Conversation } }
	| {
			type: "UPDATE_CONVERSATION";
			payload: { conversationId: string; updates: Partial<Conversation> };
	  }
	| { type: "DELETE_CONVERSATION"; payload: { conversationId: string } }
	| {
			type: "SET_ACTIVE_CONVERSATION";
			payload: { conversationId: string | null };
	  }
	| {
			type: "ADD_EVENT";
			payload: { conversationId: string; event: ConversationEvent };
	  }
	| { type: "CLEAR_EVENTS"; payload: { conversationId: string } }
	| {
			type: "SET_TYPING_INDICATOR";
			payload: { conversationId: string; indicator: TypingIndicator | null };
	  }
	| { type: "SET_AVAILABLE_AGENTS"; payload: { agents: Agent[] } }
	| { type: "SET_LOADING"; payload: { loading: boolean } }
	| { type: "SET_ERROR"; payload: { error: Error | null } }
	| {
			type: "SET_MESSAGES";
			payload: { conversationId: string; messages: Message[] };
	  }
	| {
			type: "APPEND_MESSAGES";
			payload: { conversationId: string; messages: Message[] };
	  }
	| { type: "HANDLE_REALTIME_EVENT"; payload: { event: RealtimeEvent } }
	| { type: "CLEAR_ALL" };

export interface ConversationContextValue {
	state: ConversationState;
	dispatch: React.Dispatch<ConversationAction>;
	// Utility functions
	getActiveMessages: () => Message[];
	getActiveConversation: () => Conversation | undefined;
}

const initialState: ConversationState = {
	conversations: new Map(),
	messages: new Map(),
	events: new Map(),
	typingIndicators: new Map(),
	activeConversationId: null,
	isLoading: false,
	error: null,
	availableAgents: [],
};

// Helper functions to reduce complexity
function handleAddMessage(
	state: ConversationState,
	action: ConversationAction & { type: "ADD_MESSAGE" }
): ConversationState {
	const { conversationId, message } = action.payload;
	const messages = state.messages.get(conversationId) || [];
	const newMessages = new Map(state.messages);
	newMessages.set(conversationId, [...messages, message]);
	return { ...state, messages: newMessages };
}

function handleUpdateMessage(
	state: ConversationState,
	action: ConversationAction & { type: "UPDATE_MESSAGE" }
): ConversationState {
	const { conversationId, messageId, updates } = action.payload;
	const messages = state.messages.get(conversationId);
	if (!messages) {
		return state;
	}

	const messageIndex = messages.findIndex((m) => m.id === messageId);
	if (messageIndex === -1) {
		return state;
	}

	const updatedMessages = [...messages];
	if (updatedMessages[messageIndex]) {
		updatedMessages[messageIndex] = {
			...updatedMessages[messageIndex],
			...updates,
		};
	}

	const newMessages = new Map(state.messages);
	newMessages.set(conversationId, updatedMessages);
	return { ...state, messages: newMessages };
}

function handleDeleteMessage(
	state: ConversationState,
	action: ConversationAction & { type: "DELETE_MESSAGE" }
): ConversationState {
	const { conversationId, messageId } = action.payload;
	const messages = state.messages.get(conversationId);
	if (!messages) {
		return state;
	}

	const filteredMessages = messages.filter((m) => m.id !== messageId);
	const newMessages = new Map(state.messages);
	newMessages.set(conversationId, filteredMessages);
	return { ...state, messages: newMessages };
}

function handleDeleteConversation(
	state: ConversationState,
	action: ConversationAction & { type: "DELETE_CONVERSATION" }
): ConversationState {
	const { conversationId } = action.payload;
	const newConversations = new Map(state.conversations);
	const newMessages = new Map(state.messages);
	const newEvents = new Map(state.events);
	const newTypingIndicators = new Map(state.typingIndicators);

	newConversations.delete(conversationId);
	newMessages.delete(conversationId);
	newEvents.delete(conversationId);
	newTypingIndicators.delete(conversationId);

	return {
		...state,
		conversations: newConversations,
		messages: newMessages,
		events: newEvents,
		typingIndicators: newTypingIndicators,
		activeConversationId:
			state.activeConversationId === conversationId
				? null
				: state.activeConversationId,
	};
}

function handleUpdateConversation(
	state: ConversationState,
	action: ConversationAction & { type: "UPDATE_CONVERSATION" }
): ConversationState {
	const { conversationId, updates } = action.payload;
	const conversation = state.conversations.get(conversationId);
	if (!conversation) {
		return state;
	}

	const updatedConversation = { ...conversation, ...updates };
	const newConversations = new Map(state.conversations);
	newConversations.set(conversationId, updatedConversation);
	return { ...state, conversations: newConversations };
}

function handleSetTypingIndicator(
	state: ConversationState,
	action: ConversationAction & { type: "SET_TYPING_INDICATOR" }
): ConversationState {
	const { conversationId, indicator } = action.payload;
	const newTypingIndicators = new Map(state.typingIndicators);
	if (indicator) {
		newTypingIndicators.set(conversationId, indicator);
	} else {
		newTypingIndicators.delete(conversationId);
	}
	return { ...state, typingIndicators: newTypingIndicators };
}

// Reducer function
function conversationReducer(
	state: ConversationState,
	action: ConversationAction
): ConversationState {
	switch (action.type) {
		case "ADD_MESSAGE":
			return handleAddMessage(state, action);

		case "UPDATE_MESSAGE":
			return handleUpdateMessage(state, action);

		case "DELETE_MESSAGE":
			return handleDeleteMessage(state, action);

		case "ADD_CONVERSATION": {
			const { conversation } = action.payload;
			const newConversations = new Map(state.conversations);
			newConversations.set(conversation.id, conversation);
			return { ...state, conversations: newConversations };
		}

		case "UPDATE_CONVERSATION":
			return handleUpdateConversation(state, action);

		case "DELETE_CONVERSATION":
			return handleDeleteConversation(state, action);

		case "SET_ACTIVE_CONVERSATION":
			return { ...state, activeConversationId: action.payload.conversationId };

		case "ADD_EVENT": {
			const { conversationId, event } = action.payload;
			const events = state.events.get(conversationId) || [];
			const newEvents = new Map(state.events);
			newEvents.set(conversationId, [...events, event]);
			return { ...state, events: newEvents };
		}

		case "CLEAR_EVENTS": {
			const { conversationId } = action.payload;
			const newEvents = new Map(state.events);
			newEvents.delete(conversationId);
			return { ...state, events: newEvents };
		}

		case "SET_TYPING_INDICATOR":
			return handleSetTypingIndicator(state, action);

		case "SET_AVAILABLE_AGENTS":
			return { ...state, availableAgents: action.payload.agents };

		case "SET_LOADING":
			return { ...state, isLoading: action.payload.loading };

		case "SET_ERROR":
			return { ...state, error: action.payload.error };

		case "SET_MESSAGES": {
			const { conversationId, messages } = action.payload;
			const newMessages = new Map(state.messages);
			newMessages.set(conversationId, messages);
			return { ...state, messages: newMessages };
		}

		case "APPEND_MESSAGES": {
			const { conversationId, messages } = action.payload;
			const existing = state.messages.get(conversationId) || [];
			const newMessages = new Map(state.messages);
			newMessages.set(conversationId, [...existing, ...messages]);
			return { ...state, messages: newMessages };
		}

		case "HANDLE_REALTIME_EVENT": {
			const { event } = action.payload;
			switch (event.type) {
				case "USER_PRESENCE_UPDATE":
					return state;
				default:
					return state;
			}
		}

		case "CLEAR_ALL":
			return initialState;

		default:
			return state;
	}
}

// Context
const ConversationContext = createContext<ConversationContextValue | null>(
	null
);

// Provider component
export function ConversationProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(conversationReducer, initialState);

	const getActiveMessages = (): Message[] => {
		if (!state.activeConversationId) {
			return [];
		}
		return state.messages.get(state.activeConversationId) || [];
	};

	const getActiveConversation = (): Conversation | undefined => {
		if (!state.activeConversationId) {
			return;
		}
		return state.conversations.get(state.activeConversationId);
	};

	const value: ConversationContextValue = {
		state,
		dispatch,
		getActiveMessages,
		getActiveConversation,
	};

	return (
		<ConversationContext.Provider value={value}>
			{children}
		</ConversationContext.Provider>
	);
}

// Hook to use the conversation context
export function useConversation(): ConversationContextValue {
	const context = useContext(ConversationContext);
	if (!context) {
		throw new Error(
			"useConversation must be used within a ConversationProvider"
		);
	}
	return context;
}

// Convenience hooks for common operations
export function useConversationActions() {
	const { dispatch } = useConversation();

	return {
		addMessage: (conversationId: string, message: Message) =>
			dispatch({ type: "ADD_MESSAGE", payload: { conversationId, message } }),

		updateMessage: (
			conversationId: string,
			messageId: string,
			updates: Partial<Message>
		) =>
			dispatch({
				type: "UPDATE_MESSAGE",
				payload: { conversationId, messageId, updates },
			}),

		deleteMessage: (conversationId: string, messageId: string) =>
			dispatch({
				type: "DELETE_MESSAGE",
				payload: { conversationId, messageId },
			}),

		addConversation: (conversation: Conversation) =>
			dispatch({ type: "ADD_CONVERSATION", payload: { conversation } }),

		updateConversation: (
			conversationId: string,
			updates: Partial<Conversation>
		) =>
			dispatch({
				type: "UPDATE_CONVERSATION",
				payload: { conversationId, updates },
			}),

		deleteConversation: (conversationId: string) =>
			dispatch({ type: "DELETE_CONVERSATION", payload: { conversationId } }),

		setActiveConversation: (conversationId: string | null) =>
			dispatch({
				type: "SET_ACTIVE_CONVERSATION",
				payload: { conversationId },
			}),

		addEvent: (conversationId: string, event: ConversationEvent) =>
			dispatch({ type: "ADD_EVENT", payload: { conversationId, event } }),

		clearEvents: (conversationId: string) =>
			dispatch({ type: "CLEAR_EVENTS", payload: { conversationId } }),

		setTypingIndicator: (
			conversationId: string,
			indicator: TypingIndicator | null
		) =>
			dispatch({
				type: "SET_TYPING_INDICATOR",
				payload: { conversationId, indicator },
			}),

		setAvailableAgents: (agents: Agent[]) =>
			dispatch({ type: "SET_AVAILABLE_AGENTS", payload: { agents } }),

		setLoading: (loading: boolean) =>
			dispatch({ type: "SET_LOADING", payload: { loading } }),

		setError: (error: Error | null) =>
			dispatch({ type: "SET_ERROR", payload: { error } }),

		setMessages: (conversationId: string, messages: Message[]) =>
			dispatch({ type: "SET_MESSAGES", payload: { conversationId, messages } }),

		appendMessages: (conversationId: string, messages: Message[]) =>
			dispatch({
				type: "APPEND_MESSAGES",
				payload: { conversationId, messages },
			}),

		handleRealtimeEvent: (event: RealtimeEvent) =>
			dispatch({ type: "HANDLE_REALTIME_EVENT", payload: { event } }),

		clearAll: () => dispatch({ type: "CLEAR_ALL" }),
	};
}

// Cached empty arrays to prevent infinite re-renders
const EMPTY_MESSAGES: Message[] = [];
const EMPTY_CONVERSATIONS: Conversation[] = [];

// Selector hooks for optimized re-renders
export function useActiveMessages(): Message[] {
	const { state } = useConversation();

	if (!state.activeConversationId) {
		return EMPTY_MESSAGES;
	}

	return state.messages.get(state.activeConversationId) || EMPTY_MESSAGES;
}

export function useActiveConversation(): Conversation | undefined {
	const { state } = useConversation();
	if (!state.activeConversationId) {
		return;
	}
	return state.conversations.get(state.activeConversationId);
}

export function useActiveTypingIndicator(): TypingIndicator | null {
	const { state } = useConversation();
	if (!state.activeConversationId) {
		return null;
	}
	return state.typingIndicators.get(state.activeConversationId) || null;
}

export function useConversationMessages(conversationId: string): Message[] {
	const { state } = useConversation();
	return state.messages.get(conversationId) || EMPTY_MESSAGES;
}

export function useConversationById(
	conversationId: string
): Conversation | undefined {
	const { state } = useConversation();
	return state.conversations.get(conversationId);
}

export function useAllConversations(): Conversation[] {
	const { state } = useConversation();
	if (state.conversations.size === 0) {
		return EMPTY_CONVERSATIONS;
	}
	return Array.from(state.conversations.values());
}
