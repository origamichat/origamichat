import * as React from "react";
import { useSupport } from "../provider";
import { useRenderElement } from "../utils/use-render-element";

export interface SupportBubbleProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	children?:
		| React.ReactNode
		| ((props: {
				isOpen: boolean;
				unreadCount: number;
				toggle: () => void;
		  }) => React.ReactNode);
	asChild?: boolean;
	className?: string;
}

export const SupportBubble = React.forwardRef<
	HTMLButtonElement,
	SupportBubbleProps
>(({ children, className, asChild = false, ...props }, ref) => {
	const { isOpen, toggle, unreadCount } = useSupport();

	const renderProps = { isOpen, unreadCount, toggle };
	const content =
		typeof children === "function" ? children(renderProps) : children;

	return useRenderElement(
		"button",
		{
			asChild,
			className,
		},
		{
			ref,
			state: renderProps,
			props: {
				type: "button",
				"aria-haspopup": "dialog",
				"aria-expanded": isOpen,
				onClick: toggle,
				...props,
				children: content,
			},
		}
	);
});

SupportBubble.displayName = "SupportBubble";
