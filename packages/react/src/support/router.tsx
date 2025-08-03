import type { Message, SenderType } from "@cossistant/types";
import type React from "react";
import { useSupportNavigation } from "./context/navigation";
import { ConversationPage } from "./pages/conversation";
import { ConversationHistoryPage } from "./pages/conversation-history";
import { FAQPage } from "./pages/faq";
import { HomePage } from "./pages/home";

export const SupportRouter: React.FC<{
	message: string;
	files: File[];
	isSubmitting: boolean;
	error: Error | null;
	setMessage: (message: string) => void;
	addFiles: (files: File[]) => void;
	removeFile: (index: number) => void;
	submit: () => void;
	messages?: Message[];
	events?: { id: string; event: string; timestamp?: Date }[];
	isTyping?: boolean;
	currentTypingUser?: SenderType | null;
}> = ({
	message,
	files,
	isSubmitting,
	error,
	setMessage,
	addFiles,
	removeFile,
	submit,
	messages,
	events,
	isTyping,
	currentTypingUser,
}) => {
	const { current } = useSupportNavigation();

	switch (current.page) {
		case "HOME":
			return (
				<HomePage
					addFiles={addFiles}
					currentTypingUser={currentTypingUser}
					error={error}
					events={events}
					files={files}
					isSubmitting={isSubmitting}
					isTyping={isTyping}
					message={message}
					messages={messages}
					removeFile={removeFile}
					setMessage={setMessage}
					submit={submit}
				/>
			);

		case "FAQ":
			return <FAQPage />;

		case "CONVERSATION":
			// TypeScript knows current.params exists and has conversationId here
			return (
				<ConversationPage
					addFiles={addFiles}
					conversationId={current.params.conversationId}
					currentTypingUser={currentTypingUser}
					error={error}
					events={events}
					files={files}
					isSubmitting={isSubmitting}
					isTyping={isTyping}
					message={message}
					messages={messages}
					removeFile={removeFile}
					setMessage={setMessage}
					submit={submit}
				/>
			);

		case "CONVERSATION_HISTORY":
			return <ConversationHistoryPage />;

		default: {
			return (
				<HomePage
					addFiles={addFiles}
					currentTypingUser={currentTypingUser}
					error={error}
					events={events}
					files={files}
					isSubmitting={isSubmitting}
					isTyping={isTyping}
					message={message}
					messages={messages}
					removeFile={removeFile}
					setMessage={setMessage}
					submit={submit}
				/>
			);
		}
	}
};
