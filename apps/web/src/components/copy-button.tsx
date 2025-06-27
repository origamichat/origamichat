"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function copyToClipboardWithMeta(value: string) {
	navigator.clipboard.writeText(value);
}

export function CopyButton({
	value,
	className,
	variant = "ghost",
	...props
}: React.ComponentProps<typeof Button> & {
	value: string;
	src?: string;
}) {
	const [hasCopied, setHasCopied] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, []);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					className={cn(
						"absolute top-3 right-2 z-10 size-7 bg-code hover:opacity-100 focus-visible:opacity-100",
						className
					)}
					data-slot="copy-button"
					onClick={() => {
						copyToClipboardWithMeta(value);
						setHasCopied(true);
					}}
					size="icon"
					variant={variant}
					{...props}
				>
					<span className="sr-only">Copy</span>
					{hasCopied ? <CheckIcon /> : <ClipboardIcon />}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				{hasCopied ? "Copied" : "Copy to Clipboard"}
			</TooltipContent>
		</Tooltip>
	);
}
