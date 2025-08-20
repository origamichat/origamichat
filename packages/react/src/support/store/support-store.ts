"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Navigation types
export type NavigationState =
	| { page: "HOME"; params?: undefined }
	| { page: "ARTICLES"; params?: undefined }
	| { page: "CONVERSATION"; params: { conversationId: string; initialMessage?: string } }
	| { page: "CONVERSATION_HISTORY"; params?: undefined };

export type SUPPORT_PAGES = NavigationState["page"];

export type SupportNavigation = {
	previousPages: NavigationState[];
	current: NavigationState;
};

// Config types
export type SupportConfig = {
	mode: "floating" | "responsive";
	size: "normal" | "larger";
	isOpen: boolean;
	content: {
		home?: {
			header?: string;
			subheader?: string;
			ctaLabel?: string;
		};
	};
};

// Combined store state
type SupportStoreState = {
	// Navigation state
	navigation: SupportNavigation;

	// Config state
	config: SupportConfig;
};

// Store actions
type SupportStoreActions = {
	// Navigation actions
	navigate: (state: NavigationState) => void;
	goBack: () => void;

	// Config actions
	open: () => void;
	close: () => void;
	toggle: () => void;
	updateConfig: (config: Partial<SupportConfig>) => void;

	// Reset action
	reset: () => void;
};

// Combined store type
export type SupportStore = SupportStoreState & SupportStoreActions;

// Default values
const defaultNavigation: SupportNavigation = {
	current: { page: "HOME" },
	previousPages: [],
};

const defaultConfig: SupportConfig = {
	size: "normal",
	mode: "floating",
	content: {},
	isOpen: false,
};

// Create the store
export const useSupportStore = create<SupportStore>()(
	persist(
		(set) => ({
			// Initial state
			navigation: defaultNavigation,
			config: defaultConfig,

			// Navigation actions
			navigate: (newState) =>
				set((state) => ({
					navigation: {
						previousPages: [
							...state.navigation.previousPages,
							state.navigation.current,
						],
						current: newState,
					},
				})),

			goBack: () =>
				set((state) => {
					const { previousPages } = state.navigation;
					if (previousPages.length === 0) {
						return state;
					}

					const newPreviousPages = [...previousPages];
					const previousPage = newPreviousPages.pop();

					if (!previousPage) {
						return state;
					}

					return {
						navigation: {
							previousPages: newPreviousPages,
							current: previousPage,
						},
					};
				}),

			// Config actions
			open: () =>
				set((state) => ({
					config: { ...state.config, isOpen: true },
				})),

			close: () =>
				set((state) => ({
					config: { ...state.config, isOpen: false },
				})),

			toggle: () =>
				set((state) => ({
					config: { ...state.config, isOpen: !state.config.isOpen },
				})),

			updateConfig: (newConfig) =>
				set((state) => ({
					config: { ...state.config, ...newConfig },
				})),

			// Reset action
			reset: () =>
				set({
					navigation: defaultNavigation,
					config: defaultConfig,
				}),
		}),
		{
			name: "cossistant-support-store", // localStorage key
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				// Only persist necessary parts
				navigation: state.navigation,
				config: {
					mode: state.config.mode,
					size: state.config.size,
					isOpen: state.config.isOpen,
				},
			}),
		}
	)
);

export const useSupportConfig = () => {
	const { config, open, close, toggle } = useSupportStore();

	return {
		...config,
		open,
		close,
		toggle,
	};
};

export const useSupportNavigation = () => {
	const { navigation, navigate, goBack } = useSupportStore();
	const { current, previousPages } = navigation;

	return {
		current,
		page: current.page,
		params: current.params,
		previousPages,
		navigate,
		goBack,
		canGoBack: previousPages.length > 0,
	};
};

export const initializeSupportStore = (props: {
	mode?: "floating" | "responsive";
	size?: "normal" | "larger";
	defaultOpen?: boolean;
}) => {
	const { updateConfig } = useSupportStore.getState();

	updateConfig({
		mode: props.mode ?? "floating",
		size: props.size ?? "normal",
		isOpen: props.defaultOpen ?? false,
	});
};
