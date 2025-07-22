"use client";

import React, { useCallback, useEffect, useState } from "react";

export type NavigationState =
	| { page: "HOME"; params?: undefined }
	| { page: "FAQ"; params?: undefined }
	| { page: "CONVERSATION"; params: { conversationId: string } }
	| { page: "CONVERSATION_HISTORY"; params?: undefined };

export type SUPPORT_PAGES = NavigationState["page"];

export type SupportNavigation = {
	previousPages: NavigationState[];
	current: NavigationState;
};

const STORAGE_KEY = "cossistant-support-navigation";

const getInitialNavigation = (): SupportNavigation => {
	if (typeof window === "undefined") {
		return {
			current: { page: "HOME" },
			previousPages: [],
		};
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return (
				parsed.navigation || {
					current: { page: "HOME" },
					previousPages: [],
				}
			);
		}
	} catch (error) {
		console.error("Failed to load navigation from localStorage:", error);
	}

	return {
		current: { page: "HOME" },
		previousPages: [],
	};
};

type NavigationContextValue = {
	navigation: SupportNavigation;
	setNavigation: (navigation: SupportNavigation) => void;
};

export const NavigationContext = React.createContext<NavigationContextValue>({
	navigation: getInitialNavigation(),
	setNavigation: () => {},
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [navigation, setNavigationState] =
		useState<SupportNavigation>(getInitialNavigation);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ navigation }));
		} catch (error) {
			console.error("Failed to save navigation to localStorage:", error);
		}
	}, [navigation]);

	const setNavigation = useCallback((newNavigation: SupportNavigation) => {
		setNavigationState(newNavigation);
	}, []);

	return (
		<NavigationContext.Provider value={{ navigation, setNavigation }}>
			{children}
		</NavigationContext.Provider>
	);
};

type NavigateFunction = (state: NavigationState) => void;

export const useSupportNavigation = () => {
	const context = React.useContext(NavigationContext);
	if (!context) {
		throw new Error(
			"useSupportNavigation must be used within NavigationProvider"
		);
	}

	const navigate: NavigateFunction = useCallback(
		(newState: NavigationState) => {
			context.setNavigation({
				previousPages: [
					...context.navigation.previousPages,
					context.navigation.current,
				],
				current: newState,
			});
		},
		[context]
	);

	const goBack = useCallback(() => {
		const { previousPages } = context.navigation;
		if (previousPages.length === 0) {
			return;
		}

		const newPreviousPages = [...previousPages];
		const previousPage = newPreviousPages.pop();

		if (previousPage) {
			context.setNavigation({
				previousPages: newPreviousPages,
				current: previousPage,
			});
		}
	}, [context]);

	const current = context.navigation.current;

	return {
		current,
		page: current.page,
		params: current.params,
		previousPages: context.navigation.previousPages,
		navigate,
		goBack,
		canGoBack: context.navigation.previousPages.length > 0,
	};
};
