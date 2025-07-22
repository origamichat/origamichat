"use client";

import "./support.css";

import { motion } from "motion/react";
import type React from "react";
import { Bubble, Window } from "./components";
import { SupportConfigProvider } from "./context/config";
import { NavigationProvider } from "./context/navigation";
import { SupportRouter } from "./router";
import { cn } from "./utils";

export interface SupportProps {
	className?: string;
	position?: "top" | "bottom";
	align?: "right" | "left";
	// Display the support widget in a floating window or in responsive mode (takes the full width / height of the parent)
	mode?: "floating" | "responsive";
}

export const Support: React.FC<SupportProps> = ({
	className,
	position = "bottom",
	align = "right",
	mode = "floating",
}) => {
	const containerClasses = cn(
		"cossistant",
		{
			// Floating mode positioning
			"fixed z-[9999]": mode === "floating",
			"bottom-4": mode === "floating" && position === "bottom",
			"top-4": mode === "floating" && position === "top",
			"right-4": mode === "floating" && align === "right",
			"left-4": mode === "floating" && align === "left",
			// Responsive mode
			"relative h-full w-full": mode === "responsive",
		},
		className
	);

	const windowClasses = cn({
		// Floating mode window positioning
		"absolute z-[9999]": mode === "floating",
		"bottom-16": mode === "floating" && position === "bottom",
		"top-16": mode === "floating" && position === "top",
		"right-0": mode === "floating" && align === "right",
		"left-0": mode === "floating" && align === "left",
		// Responsive mode window
		"relative h-full w-full rounded-none border-0 shadow-none":
			mode === "responsive",
	});

	return (
		<SupportConfigProvider mode={mode}>
			<NavigationProvider>
				<motion.div className={containerClasses}>
					{mode === "floating" && <Bubble />}
					<Window className={windowClasses}>
						<SupportRouter />
					</Window>
				</motion.div>
			</NavigationProvider>
		</SupportConfigProvider>
	);
};

export default Support;

export { useSupportConfig } from "./context/config";
// Export navigation types and hooks for advanced usage
export {
	type NavigationState,
	type SUPPORT_PAGES,
	useSupportNavigation,
} from "./context/navigation";
