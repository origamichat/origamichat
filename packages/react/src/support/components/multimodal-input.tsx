"use client";

import type React from "react";
import { useRef } from "react";
import * as Primitive from "../../primitive";
import { cn } from "../utils";
import Icon from "./icons";
import { Watermark } from "./watermark";

export interface MultimodalInputProps {
	className?: string;
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	onFileSelect?: (files: File[]) => void;
	placeholder?: string;
	disabled?: boolean;
	isSubmitting?: boolean;
	error?: Error | null;
	files?: File[];
	onRemoveFile?: (index: number) => void;
	maxFiles?: number;
	maxFileSize?: number;
	allowedFileTypes?: string[];
}

export const MultimodalInput: React.FC<MultimodalInputProps> = ({
	className,
	value,
	onChange,
	onSubmit,
	onFileSelect,
	placeholder = "Type your message...",
	disabled = false,
	isSubmitting = false,
	error,
	files = [],
	onRemoveFile,
	maxFiles = 5,
	maxFileSize = 10 * 1024 * 1024, // 10MB
	allowedFileTypes = ["image/*", "application/pdf", "text/*"],
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!(disabled || isSubmitting) && (value.trim() || files.length > 0)) {
			onSubmit();
		}
	};

	const handleAttachClick = () => {
		if (files.length < maxFiles) {
			fileInputRef.current?.click();
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) {
			return `${bytes} B`;
		}
		if (bytes < 1024 * 1024) {
			return `${(bytes / 1024).toFixed(1)} KB`;
		}
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const canSubmit =
		!(disabled || isSubmitting) &&
		(value.trim().length > 0 || files.length > 0);

	return (
		<form className="flex flex-col gap-2" onSubmit={handleFormSubmit}>
			{/* Error message */}
			{error && (
				<div
					className="rounded-md bg-co-destructive-muted p-2 text-co-destructive text-xs"
					id="multimodal-input-error"
				>
					{error.message}
				</div>
			)}

			{/* File attachments */}
			{files.length > 0 && (
				<div className="flex flex-wrap gap-2 p-2">
					{files.map((file, index) => (
						<div
							className="flex items-center gap-2 rounded-md bg-co-muted px-2 py-1 text-xs"
							key={`${file.name}-${index}`}
						>
							<Icon className="h-3 w-3" name="attachment" />
							<span className="max-w-[150px] truncate">{file.name}</span>
							<span className="text-co-muted-foreground">
								{formatFileSize(file.size)}
							</span>
							{onRemoveFile && (
								<button
									aria-label={`Remove ${file.name}`}
									className="ml-1 hover:text-co-destructive"
									onClick={() => onRemoveFile(index)}
									type="button"
								>
									<Icon className="h-3 w-3" name="close" />
								</button>
							)}
						</div>
					))}
				</div>
			)}

			{/* Input area */}
			<div className="flex flex-col rounded-md border border-co-border bg-co-background">
				<Primitive.MultimodalInput
					className={cn(
						"flex-1 resize-none overflow-hidden p-3 text-co-foreground text-sm placeholder:text-primary/40 focus-visible:outline-none",
						className
					)}
					disabled={disabled || isSubmitting}
					error={error}
					onChange={onChange}
					onFileSelect={onFileSelect}
					onSubmit={onSubmit}
					placeholder={placeholder}
					value={value}
				/>

				<div className="flex items-center justify-between py-1 pr-1 pl-3">
					<Watermark />

					<div className="flex items-center gap-1">
						{/* File attachment button */}
						{onFileSelect && (
							<>
								<button
									aria-label="Attach files"
									className={cn(
										"group flex h-8 w-8 items-center justify-center rounded-md text-co-muted-foreground hover:bg-co-muted hover:text-co-foreground disabled:cursor-not-allowed disabled:opacity-50",
										files.length >= maxFiles && "opacity-50"
									)}
									disabled={
										disabled || isSubmitting || files.length >= maxFiles
									}
									onClick={handleAttachClick}
									type="button"
								>
									<Icon className="h-4 w-4" name="attachment" />
								</button>

								<Primitive.FileInput
									accept={allowedFileTypes.join(",")}
									className="hidden"
									disabled={
										disabled || isSubmitting || files.length >= maxFiles
									}
									onFileSelect={onFileSelect}
									ref={fileInputRef}
								/>
							</>
						)}

						{/* Send button */}
						<SendButton disabled={!canSubmit || isSubmitting} />
					</div>
				</div>
			</div>
		</form>
	);
};

export interface SendButtonProps {
	className?: string;
	disabled?: boolean;
}

export const SendButton: React.FC<SendButtonProps> = ({
	className,
	disabled = false,
}) => {
	return (
		<Primitive.Button
			className={cn(
				"group flex h-8 w-8 items-center justify-center rounded-md text-co-primary hover:bg-co-muted disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			disabled={disabled}
			type="submit"
		>
			<Icon className="h-4 w-4" filledOnHover name="send" />
		</Primitive.Button>
	);
};
