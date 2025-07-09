"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { CommandShortcut } from "./command-shortcut";

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger({
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 0,
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				className={cn(
					"fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in text-balance rounded bg-primary px-3 py-1.5 text-primary-foreground text-sm data-[state=closed]:animate-out",
					className
				)}
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded bg-primary fill-primary" />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export function TooltipOnHover({
	children,
	content,
	forceClose = false,
	shortcuts,
	className,
	side = "top",
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
					className={cn(
						"pr-0 pl-2",
						{
							"pr-1.5": !!shortcuts,
						},
						className
					)}
					side={side}
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
