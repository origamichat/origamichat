import { useCallback, useRef, useState } from "react";

export interface UseMultimodalInputOptions {
	onSubmit?: (data: { message: string; files: File[] }) => void | Promise<void>;
	onError?: (error: Error) => void;
	maxFileSize?: number; // in bytes
	maxFiles?: number;
	allowedFileTypes?: string[]; // MIME types
}

export interface UseMultimodalInputReturn {
	// State
	message: string;
	files: File[];
	isSubmitting: boolean;
	error: Error | null;

	// Actions
	setMessage: (message: string) => void;
	addFiles: (files: File[]) => void;
	removeFile: (index: number) => void;
	clearFiles: () => void;
	submit: () => Promise<void>;
	reset: () => void;

	// Validation
	isValid: boolean;
	canSubmit: boolean;
}

export const useMultimodalInput = ({
	onSubmit,
	onError,
	maxFileSize = 10 * 1024 * 1024, // 10MB default
	maxFiles = 5,
	allowedFileTypes = ["image/*", "application/pdf", "text/*"],
}: UseMultimodalInputOptions = {}): UseMultimodalInputReturn => {
	const [message, setMessage] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// Use ref to prevent re-renders when tracking file URLs
	const fileUrlsRef = useRef<string[]>([]);

	// Validation helpers
	const validateFile = useCallback(
		(file: File): string | null => {
			if (file.size > maxFileSize) {
				return `File "${file.name}" exceeds maximum size of ${maxFileSize / 1024 / 1024}MB`;
			}

			if (allowedFileTypes.length > 0) {
				const isAllowed = allowedFileTypes.some((type) => {
					if (type.endsWith("/*")) {
						const baseType = type.slice(0, -2);
						return file.type.startsWith(baseType);
					}
					return file.type === type;
				});

				if (!isAllowed) {
					return `File type "${file.type}" is not allowed`;
				}
			}

			return null;
		},
		[maxFileSize, allowedFileTypes]
	);

	// Actions
	const addFiles = useCallback(
		(newFiles: File[]) => {
			setError(null);

			// Check max files limit
			if (files.length + newFiles.length > maxFiles) {
				const err = new Error(
					`Cannot add files: maximum ${maxFiles} files allowed`
				);
				setError(err);
				onError?.(err);
				return;
			}

			// Validate each file
			for (const file of newFiles) {
				const validationError = validateFile(file);
				if (validationError) {
					const err = new Error(validationError);
					setError(err);
					onError?.(err);
					return;
				}
			}

			setFiles((prev) => [...prev, ...newFiles]);
		},
		[files.length, maxFiles, validateFile, onError]
	);

	const removeFile = useCallback((index: number) => {
		setFiles((prev) => {
			const newFiles = [...prev];
			newFiles.splice(index, 1);

			// Clean up object URL if it exists
			if (fileUrlsRef.current[index]) {
				URL.revokeObjectURL(fileUrlsRef.current[index]);
				fileUrlsRef.current.splice(index, 1);
			}

			return newFiles;
		});
		setError(null);
	}, []);

	const clearFiles = useCallback(() => {
		// Clean up all object URLs
		for (const url of fileUrlsRef.current) {
			URL.revokeObjectURL(url);
		}
		fileUrlsRef.current = [];

		setFiles([]);
		setError(null);
	}, []);

	const reset = useCallback(() => {
		setMessage("");
		clearFiles();
		setError(null);
		setIsSubmitting(false);
	}, [clearFiles]);

	const submit = useCallback(async () => {
		if (!onSubmit) {
			console.warn("useMultimodalInput: No onSubmit handler provided");
			return;
		}

		if (!message.trim() && files.length === 0) {
			const err = new Error("Please provide a message or attach files");
			setError(err);
			onError?.(err);
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			await onSubmit({ message: message.trim(), files });
			reset();
		} catch (err) {
			const _error = err instanceof Error ? err : new Error("Failed to submit");
			setError(_error);
			onError?.(_error);
		} finally {
			setIsSubmitting(false);
		}
	}, [message, files, onSubmit, onError, reset]);

	// Computed values
	const isValid = message.trim().length > 0 || files.length > 0;
	const canSubmit = isValid && !isSubmitting && !error;

	return {
		// State
		message,
		files,
		isSubmitting,
		error,

		// Actions
		setMessage,
		addFiles,
		removeFile,
		clearFiles,
		submit,
		reset,

		// Validation
		isValid,
		canSubmit,
	};
};
