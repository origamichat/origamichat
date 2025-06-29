import * as React from "react";
import { useRenderElement } from "../utils/use-render-element";

export interface SupportSendButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	className?: string;
}

export const SupportSendButton = React.forwardRef<
	HTMLButtonElement,
	SupportSendButtonProps
>(({ className, asChild = false, ...props }, ref) => {
	return useRenderElement(
		"button",
		{
			className,
			asChild,
		},
		{
			ref,
			props: {
				type: "button",
				...props,
			},
		}
	);
});

SupportSendButton.displayName = "SupportSendButton";
