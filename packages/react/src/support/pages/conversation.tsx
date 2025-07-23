import { useMultimodalInput } from "@cossistant/react/hooks/use-multimodal-input";
import type React from "react";
import { useState } from "react";
import { Container } from "../components/container";
import { Header } from "../components/header";
import { MultimodalInput } from "../components/multimodal-input";
import { useSupportNavigation } from "../context/navigation";

interface ConversationPageProps {
	conversationId: string;
}

export const ConversationPage: React.FC<ConversationPageProps> = ({
	conversationId,
}) => {
	const { goBack, canGoBack } = useSupportNavigation();

	const {
		message,
		files,
		isSubmitting,
		error,
		setMessage,
		addFiles,
		removeFile,
		submit,
	} = useMultimodalInput({
		onSubmit: async (data) => {
			console.log("Submitting:", data);

			console.log(`Message: ${data.message}`);
			console.log(`Files: ${data.files.length} files attached`);
		},
		onError: (_error) => {
			console.error("Multimodal input error:", _error);
		},
	});

	return (
		<>
			<Header>
				<div className="flex w-full items-center gap-2.5">
					{canGoBack && (
						<button
							className="cursor-pointer rounded border-none bg-transparent p-1 px-2 text-base hover:bg-gray-100"
							onClick={goBack}
							type="button"
						>
							←
						</button>
					)}
					<span className="font-medium text-sm">
						Conversation {conversationId}
					</span>
				</div>
			</Header>
			<Container>
				<div className="flex-1" />

				<MultimodalInput
					disabled={isSubmitting}
					error={error}
					files={files}
					isSubmitting={isSubmitting}
					onChange={setMessage}
					onFileSelect={addFiles}
					onRemoveFile={removeFile}
					onSubmit={submit}
					placeholder="Type your message or paste an image..."
					value={message}
				/>
			</Container>
		</>
	);
};
