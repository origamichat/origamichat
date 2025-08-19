import * as React from "react";
import { useSupportConfig } from "../support/context/config";
import { useRenderElement } from "../utils/use-render-element";

export interface WindowRenderProps {
	isOpen: boolean;
	close: () => void;
}

export interface WindowProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode | ((props: WindowRenderProps) => React.ReactNode);
	asChild?: boolean;
	closeOnEscape?: boolean;
	id?: string;
}

export const SupportWindow = React.forwardRef<HTMLDivElement, WindowProps>(
	(
		{
			isOpen: isOpenProp,
			onOpenChange,
			children,
			className,
			asChild = false,
			closeOnEscape = true,
			id = "cossistant-window",
			...props
		},
		ref
	) => {
		const { isOpen, close, mode } = useSupportConfig();

		// In responsive mode, window is always open
		// Otherwise use normal open/close logic
		const open = mode === "responsive" ? true : (isOpenProp ?? isOpen ?? false);

		const closeFn = React.useCallback(() => {
			if (onOpenChange) {
				onOpenChange(false);
			} else if (close) {
				close();
			}
		}, [onOpenChange, close]);

		// Close on Escape
		React.useEffect(() => {
			if (!(open && closeOnEscape)) {
				return;
			}
			const onKey = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					close();
				}
			};
			window.addEventListener("keydown", onKey);
			return () => window.removeEventListener("keydown", onKey);
		}, [open, close, closeOnEscape]);

		const renderProps: WindowRenderProps = { isOpen: open, close: closeFn };

		const content =
			typeof children === "function" ? children(renderProps) : children;

		return useRenderElement(
			"div",
			{
				className,
				asChild,
			},
			{
				ref,
				state: renderProps,
				props: {
					role: "dialog",
					"aria-modal": "true",
					id,
					...props,
					children: content,
				},
				enabled: open,
			}
		);
	}
);

SupportWindow.displayName = "SupportWindow";
