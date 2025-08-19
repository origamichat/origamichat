import * as React from "react";
import { useRenderElement } from "../utils/use-render-element";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, asChild = false, ...props }, ref) => {
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
	}
);

Button.displayName = "Button";
