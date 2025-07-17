"use client";

import type React from "react";
import { useMemo } from "react";
import * as Primitive from "../../primitive";
import { useSupport } from "../../provider";
import { cn } from "../utils";
import { CossistantLogo } from "./cossistant-branding";
import Icon from "./icons";

export interface InputContainerProps {
	className?: string;
	children: React.ReactNode;
}

export const InputContainer: React.FC<InputContainerProps> = ({
	className,
	children,
}) => {
	return <div className={cn("flex flex-col", className)}>{children}</div>;
};

export interface InputWrapperProps {
	className?: string;
	children: React.ReactNode;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
	className,
	children,
}) => {
	return (
		<div
			className={cn(
				"flex items-end gap-2 border-co-border border-t p-3",
				className
			)}
		>
			{children}
		</div>
	);
};

export interface InputProps {
	className?: string;
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	placeholder?: string;
}

export const Input: React.FC<InputProps> = ({
	className,
	value,
	onChange,
	onSubmit,
	placeholder = "Type your message...",
}) => {
	return (
		<Primitive.Input
			className={cn(
				"flex-1 resize-none overflow-hidden rounded-md border border-co-border bg-co-background px-2 py-1 text-co-foreground text-sm placeholder:text-co-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-co-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			onChange={onChange}
			onSubmit={onSubmit}
			placeholder={placeholder}
			value={value}
		/>
	);
};

export interface SendButtonProps {
	className?: string;
	onClick: () => void;
	disabled?: boolean;
}

export const SendButton: React.FC<SendButtonProps> = ({
	className,
	onClick,
	disabled = false,
}) => {
	return (
		<Primitive.SendButton
			className={cn(
				"group flex h-8 w-8 items-center justify-center rounded-md text-co-primary hover:bg-co-muted disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			disabled={disabled}
			onClick={onClick}
		>
			<Icon className="h-4 w-4" filledOnHover name="send" />
		</Primitive.SendButton>
	);
};

export interface FooterProps {
	className?: string;
	children?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({ className, children }) => {
	const { website } = useSupport();

	const cossistantUrl = useMemo(() => {
		const url = new URL(website?.url || "");
		url.searchParams.set("ref", "chatbox");
		url.searchParams.set("domain", website?.domain);
		url.searchParams.set("name", website.name);

		return url.toString();
	}, [website]);

	return (
		<div className={cn("flex h-8 items-center justify-center px-3", className)}>
			{children || (
				<a
					className="flex items-center gap-1 font-medium font-mono text-co-primary hover:text-co-cossistant-blue"
					href={cossistantUrl}
					rel="noopener noreferrer"
					target="_blank"
				>
					<span className="text-co-muted-foreground text-xs">We run on</span>
					<CossistantLogo className="h-3" />
				</a>
			)}
		</div>
	);
};
