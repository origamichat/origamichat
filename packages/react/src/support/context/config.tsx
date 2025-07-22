"use client";

import React from "react";

export type SupportConfig = {
	mode: "floating" | "responsive";
	content: {
		home?: {
			header?: string;
			subheader?: string;
			ctaLabel?: string;
		};
	};
};

type SupportConfigContextValue = {
	config: SupportConfig;
};

export const SupportConfigContext =
	React.createContext<SupportConfigContextValue>({
		config: {
			mode: "floating",
			content: {},
		},
	});

export const SupportConfigProvider: React.FC<{
	children: React.ReactNode;
	mode?: "floating" | "responsive";
}> = ({ children, mode = "floating" }) => {
	const config: SupportConfig = { mode, content: {} };

	return (
		<SupportConfigContext.Provider value={{ config }}>
			{children}
		</SupportConfigContext.Provider>
	);
};

export const useSupportConfig = () => {
	const context = React.useContext(SupportConfigContext);
	if (!context) {
		throw new Error(
			"useSupportConfig must be used within SupportConfigProvider"
		);
	}
	return context.config;
};
