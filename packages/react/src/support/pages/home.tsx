import type React from "react";
import { useSupport } from "../..";
import { useMultimodalInput } from "../../hooks/use-multimodal-input";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { Container } from "../components/container";
import { MultimodalInput } from "../components/multimodal-input";
import { useSupportConfig } from "../context/config";

export const HomePage: React.FC = () => {
	const { content } = useSupportConfig();
	const { website } = useSupport();

	const availableAgents = website?.availableAgents || [];

	// Use the multimodal input hook
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

			// Here you would typically:
			// 1. Upload files to S3 (if any)
			// 2. Create a conversation
			// 3. Send the message
			// 4. Navigate to the conversation page

			// For now, just log the submission
			console.log(`Message: ${data.message}`);
			console.log(`Files: ${data.files.length} files attached`);

			// TODO: Implement actual submission logic
			// navigate("/conversation/new-conversation-id");
		},
		onError: (_error) => {
			console.error("Multimodal input error:", _error);
		},
	});

	return (
		<>
			<Container className="flex h-full flex-col px-2 pt-6 pb-2">
				<div className="flex flex-col gap-2.5 px-4">
					{availableAgents.map((agent) => (
						<Avatar
							className="mb-10 flex size-12 items-center justify-center rounded-full border bg-co-background-200"
							key={agent.id}
						>
							{agent.image && (
								<AvatarImage alt={agent.name} src={agent.image} />
							)}
							<AvatarFallback className="text-xs" name={agent.name} />
						</Avatar>
					))}
					<div className="flex flex-col gap-2.5 px-1">
						<h2 className="mb-2.5 font-medium text-2xl text-primary">
							{content.home?.header || "Hi there! 👋"}
						</h2>
						<p className="mb-5 text-balance text-primary/60">
							{content.home?.subheader ||
								"Need help? Our AI and human customer support is here to help you."}
						</p>
					</div>
				</div>

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
