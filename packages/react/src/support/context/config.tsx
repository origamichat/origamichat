import React from "react";

// Internal context for Support component configuration
export const SupportConfigContext = React.createContext<{
	mode: "floating" | "responsive";
}>({ mode: "floating" });

export const useSupportConfig = () => React.useContext(SupportConfigContext);
