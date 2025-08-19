"use client";

import { motion } from "motion/react";
import type React from "react";
import { useMultimodalInput } from "../../hooks/use-multimodal-input";

import { SupportRouter } from "../router";
import { cn } from "../utils";
import { Bubble } from "./bubble";
import { Window } from "./window";

interface SupportContentProps {
	className?: string;
	position?: "top" | "bottom";
	align?: "right" | "left";
	mode?: "floating" | "responsive";
}

export const SupportContent: React.FC<SupportContentProps> = ({
	className,
	position = "bottom",
	align = "right",
	mode = "floating",
}) => {
	const {
		message,
		files,
		isSubmitting,
		error,
		setMessage,
		addFiles,
		removeFile,
		submit,
	} = useMultimodalInput({
		onSubmit: async (data) => {},
		onError: () => {},
	});

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
		<motion.div
			animate={{ opacity: 1 }}
			className={containerClasses}
			initial={{ opacity: 0 }}
			layout="position"
			transition={{
				default: { ease: "anticipate" },
				layout: { duration: 0.3 },
			}}
		>
			{mode === "floating" && <Bubble />}
			<Window className={windowClasses}>
				<SupportRouter
					addFiles={addFiles}
					error={error}
					files={files}
					isSubmitting={isSubmitting}
					message={message}
					removeFile={removeFile}
					setMessage={setMessage}
					submit={submit}
				/>
			</Window>
		</motion.div>
	);
};
