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
}

export const Support: React.FC<SupportProps> = ({
	className,
	title = "Support",
	placeholder = "Type your message...",
	footer,
	onSubmit,
}) => {
	const [value, setValue] = React.useState("");

	const handleSubmit = () => {
		if (onSubmit) {
			onSubmit(value);
		}
		// TODO: integrate with backend
		setValue("");
	};

	return (
		<div className={cn("", className)}>
			<Bubble />
			<Window>
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

// Export all components for flexible usage
export * from "./components";
export { cn } from "./utils";

export default Support;
