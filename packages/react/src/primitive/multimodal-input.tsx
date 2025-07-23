import * as React from "react";
import { useRenderElement } from "../utils/use-render-element";

export interface MultimodalInputProps
	extends Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		"value" | "onChange"
	> {
	value: string;
	onChange: (value: string) => void;
	onSubmit?: () => void;
	onFileSelect?: (files: File[]) => void;
	asChild?: boolean;
	className?: string;
	error?: Error | null;
	disabled?: boolean;
}

export const MultimodalInput = React.forwardRef<
	HTMLTextAreaElement,
	MultimodalInputProps
>(
	(
		{
			value,
			onChange,
			onSubmit,
			onFileSelect,
			className,
			asChild = false,
			error,
			disabled,
			...props
		},
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

		// Handle paste events for images
		const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
			const items = Array.from(e.clipboardData.items);
			const files: File[] = [];

			for (const item of items) {
				if (item.kind === "file") {
					const file = item.getAsFile();
					if (file) {
						files.push(file);
					}
				}
			}

			if (files.length > 0 && onFileSelect) {
				e.preventDefault();
				onFileSelect(files);
			}

			props.onPaste?.(e);
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
					onPaste: handlePaste,
					disabled,
					"aria-invalid": error ? "true" : undefined,
					"aria-describedby": error ? "multimodal-input-error" : undefined,
				},
			}
		);
	}
);

MultimodalInput.displayName = "MultimodalInput";

// File input component for multimodal input
export interface FileInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	onFileSelect?: (files: File[]) => void;
	asChild?: boolean;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
	({ onFileSelect, asChild = false, className, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			if (files.length > 0 && onFileSelect) {
				onFileSelect(files);
				// Reset input to allow selecting the same file again
				e.target.value = "";
			}
			props.onChange?.(e);
		};

		return useRenderElement(
			"input",
			{
				className,
				asChild,
			},
			{
				ref,
				props: {
					...props,
					type: "file",
					multiple: true,
					onChange: handleChange,
				},
			}
		);
	}
);

FileInput.displayName = "FileInput";

// Export the old name for backward compatibility
export const SupportInput = MultimodalInput;
