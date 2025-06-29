import * as React from "react";
import { useRenderElement } from "../utils/use-render-element";

export interface SupportInputProps
	extends Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"value" | "onChange"
	> {
	value: string;
	onChange: (value: string) => void;
	onSubmit?: () => void;
	asChild?: boolean;
	className?: string;
}

export const SupportInput = React.forwardRef<
	HTMLTextAreaElement,
	SupportInputProps
>(
	(
		{ value, onChange, onSubmit, className, asChild = false, ...props },
		ref
	) => {
		const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
		React.useImperativeHandle(
			ref,
			() => innerRef.current as HTMLTextAreaElement
		);

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				onSubmit?.();
			}
			props.onKeyDown?.(e);
		};

		// Auto-resize
		// biome-ignore lint/correctness/useExhaustiveDependencies: works well here
		React.useLayoutEffect(() => {
			const el = innerRef.current;
			if (!el) {
				return;
			}
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
		}, [value]);

		return useRenderElement(
			"textarea",
			{
				className,
				asChild,
			},
			{
				ref: innerRef,
				props: {
					...props,
					value,
					rows: 1,
					onChange: handleChange,
					onKeyDown: handleKeyDown,
				},
			}
		);
	}
);

SupportInput.displayName = "SupportInput";
