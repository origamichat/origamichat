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
				"flex h-[580px] w-96 flex-col rounded-lg border border-co-border bg-co-background shadow-lg max-[640px]:h-[calc(100vh-4rem)] max-[640px]:max-h-[580px] max-[480px]:w-auto max-[480px]:max-w-[calc(100vw-1rem)]",
				className
			)}
		>
			{children}
		</Primitive.Window>
	);
};
