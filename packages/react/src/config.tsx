"use client";

import * as React from "react";
import { useSupport } from "./provider";

export type SupportConfigProps = {
	defaultMessages?: string[];
	quickOptions?: string[];
};

/**
 * @description
 * This component is used to configure the support widget.
 * It is used to set the default messages and quick options.
 * @param defaultMessages - The default messages to set.
 * @param quickOptions - The quick options to set.
 */

export const SupportConfig = ({
	defaultMessages,
	quickOptions,
}: SupportConfigProps) => {
	const { setDefaultMessages, setQuickOptions } = useSupport();

	React.useEffect(() => {
		if (defaultMessages) {
			setDefaultMessages(defaultMessages);
		}
		if (quickOptions) {
			setQuickOptions(quickOptions);
		}
	}, [defaultMessages, quickOptions, setDefaultMessages, setQuickOptions]);

	return <></>;
};

SupportConfig.displayName = "SupportConfig";
