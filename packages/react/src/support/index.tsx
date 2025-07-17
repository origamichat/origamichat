"use client";

import "./styles.css";

import React from "react";
import {
	Bubble,
	Content,
	Footer,
	Header,
	Input,
	InputContainer,
	InputWrapper,
	SendButton,
	Window,
} from "./components";
import { cn } from "./utils";

export interface SupportProps {
	className?: string;
	title?: string;
	placeholder?: string;
	footer?: React.ReactNode;
	onSubmit?: (message: string) => void;
	position?: "top" | "bottom";
	align?: "right" | "left";
	mode?: "floating" | "responsive";
}

export const Support: React.FC<SupportProps> = ({
	className,
	title = "Support",
	placeholder = "Type your message...",
	footer,
	onSubmit,
	position = "bottom",
	align = "right",
	mode = "floating",
}) => {
	const [value, setValue] = React.useState("");

	const handleSubmit = () => {
		if (onSubmit) {
			onSubmit(value);
		}
		// TODO: integrate with backend
		setValue("");
	};

	const containerClasses = cn(
		"cossistant",
		{
			// Floating mode positioning
			"fixed z-50": mode === "floating",
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
		<div className={containerClasses}>
			{mode === "floating" && <Bubble />}
			<Window className={windowClasses}>
				<Header title={title} />
				<Content>{/* messages go here */}</Content>
				<InputContainer>
					<InputWrapper>
						<Input
							onChange={setValue}
							onSubmit={handleSubmit}
							placeholder={placeholder}
							value={value}
						/>
						<SendButton onClick={handleSubmit} />
					</InputWrapper>
					<Footer>{footer}</Footer>
				</InputContainer>
			</Window>
		</div>
	);
};

export default Support;
