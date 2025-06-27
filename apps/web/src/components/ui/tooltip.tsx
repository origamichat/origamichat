"use client";

import {
	TooltipContent as TooltipContentPrimitive,
	TooltipPortal,
	Tooltip as TooltipPrimitive,
	TooltipProvider as TooltipProviderPrimitive,
	TooltipTrigger as TooltipTriggerPrimitive,
} from "@radix-ui/react-tooltip";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { CommandShortcut } from "./command-shortcut";

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipProviderPrimitive>) {
	return (
		<TooltipProviderPrimitive
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive>) {
	return (
		<TooltipProvider>
			<TooltipPrimitive data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipTriggerPrimitive>) {
	return <TooltipTriggerPrimitive data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipContentPrimitive>) {
	return (
		<TooltipPortal>
			<TooltipContentPrimitive
				className={cn(
					"fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded-md bg-primary p-0.5 text-primary-foreground text-xs shadow-2xl data-[state=closed]:animate-out",
					className
				)}
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				{...props}
			>
				{children}
			</TooltipContentPrimitive>
		</TooltipPortal>
	);
}

export function TooltipOnHover({
	children,
	content,
	forceClose = false,
	shortcuts,
	className,
	side = "bottom",
	footerContent,
	align,
}: {
	children: React.ReactNode;
	content?: React.ReactNode;
	footerContent?: React.ReactNode;
	forceClose?: boolean;
	className?: string;
	shortcuts?: string[];
	side?: "bottom" | "left" | "right" | "top";
	align?: "center" | "end" | "start";
}) {
	if (forceClose || !content) {
		return <>{children}</>;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					align={align}
					className={cn("pl-2", className)}
					side={side}
					sideOffset={8}
				>
					<div className="flex items-center justify-center">
						<span className="mr-2">{content}</span>
						{shortcuts && (
							<CommandShortcut className="ml-2">{shortcuts}</CommandShortcut>
						)}
					</div>

					{footerContent && (
						<div className="border-t px-2 py-1.5">{footerContent}</div>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
