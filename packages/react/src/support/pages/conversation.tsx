import type { Message as MessageType, SenderType } from "@cossistant/types";
import type React from "react";
import { useSupport } from "../..";
import { Container } from "../components/container";
import { Header } from "../components/header";
import { MessageList } from "../components/message-list";
import { MultimodalInput } from "../components/multimodal-input";
import { useSupportNavigation } from "../context/navigation";

interface ConversationPageProps {
	conversationId: string;
	message: string;
	files: File[];
	isSubmitting: boolean;
	error: Error | null;
	setMessage: (message: string) => void;
	addFiles: (files: File[]) => void;
	removeFile: (index: number) => void;
	submit: () => void;
	messages?: MessageType[];
	events?: { id: string; event: string; timestamp?: Date }[];
	isTyping?: boolean;
	currentTypingUser?: SenderType | null;
}

export const ConversationPage: React.FC<ConversationPageProps> = ({
	conversationId,
	message,
	files,
	isSubmitting,
	error,
	setMessage,
	addFiles,
	removeFile,
	submit,
	messages = [],
	events = [],
	isTyping = false,
	currentTypingUser,
}) => {
	const { goBack, canGoBack } = useSupportNavigation();
	const { website } = useSupport();
	const availableAgents = website?.availableAgents || [];

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
			<Container className="flex h-full flex-col px-2 pt-0 pb-2">
				<MessageList
					availableAgents={availableAgents}
					className="flex-1"
					events={events}
					isTyping={isTyping}
					messages={messages}
					typingSenderName={
						currentTypingUser === "visitor"
							? "You"
							: currentTypingUser === "ai"
								? "AI Assistant"
								: currentTypingUser === "team_member"
									? "Support Agent"
									: "Support"
					}
				/>

				<div className="px-2 pt-2">
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
				</div>
			</Container>
		</>
	);
};
