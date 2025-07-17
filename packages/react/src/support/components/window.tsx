"use client";

import type React from "react";
import * as Primitive from "../../primitive";
import { cn } from "../utils";

export interface WindowProps {
	className?: string;
	children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ className, children }) => {
	return (
		<Primitive.Window
			className={cn(
				"flex h-[580px] w-80 flex-col rounded-lg border border-co-border bg-co-background shadow-lg max-[640px]:h-[calc(100vh-4rem)] max-[640px]:max-h-[580px] max-[480px]:w-auto max-[480px]:max-w-[calc(100vw-1rem)]",
				className
			)}
		>
			{children}
		</Primitive.Window>
	);
};

export interface HeaderProps {
	className?: string;
	title?: string;
	children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
	className,
	title = "Support",
	children,
}) => {
	return (
		<div
			className={cn(
				"flex h-10 items-center border-co-border border-b px-3",
				className
			)}
		>
			{children || (
				<p className="font-medium text-co-foreground text-sm">{title}</p>
			)}
		</div>
	);
};

export interface ContentProps {
	className?: string;
	children?: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ className, children }) => {
	return (
		<div className={cn("flex-1 overflow-y-auto p-3", className)}>
			{children}
		</div>
	);
};
