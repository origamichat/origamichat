"use client";

import * as React from "react";
import { type DefaultMessage, useSupport } from "./provider";

export type SupportConfigProps = {
  defaultMessages?: DefaultMessage[];
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

  // Only update when the arrays actually change content
  React.useEffect(() => {
    if (defaultMessages) {
      setDefaultMessages(defaultMessages);
    }
  }, [defaultMessages, setDefaultMessages]);

  React.useEffect(() => {
    if (quickOptions) {
      setQuickOptions(quickOptions);
    }
  }, [quickOptions, setQuickOptions]);

  return null;
};

SupportConfig.displayName = "SupportConfig";
