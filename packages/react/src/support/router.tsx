import type React from "react";
import { ConversationPage } from "./pages/conversation";
import { ConversationHistoryPage } from "./pages/conversation-history";
import { FAQPage } from "./pages/faq";
import { HomePage } from "./pages/home";
import { useSupportNavigation } from "./store/support-store";

export const SupportRouter: React.FC<{
	message: string;
	files: File[];
	isSubmitting: boolean;
	error: Error | null;
	setMessage: (message: string) => void;
	addFiles: (files: File[]) => void;
	removeFile: (index: number) => void;
	submit: () => void;
}> = ({
	message,
	files,
	isSubmitting,
	error,
	setMessage,
	addFiles,
	removeFile,
	submit,
}) => {
	const { current } = useSupportNavigation();

	switch (current.page) {
		case "HOME":
			return <HomePage onStartConversation={() => {}} />;

		case "FAQ":
			return <FAQPage />;

		case "CONVERSATION":
			// TypeScript knows current.params exists and has conversationId here
			return (
				<ConversationPage
					addFiles={addFiles}
					conversationId={current.params.conversationId}
					error={error}
					events={[]}
					files={files}
					isSubmitting={isSubmitting}
					message={message}
					messages={[]}
					removeFile={removeFile}
					setMessage={setMessage}
					submit={submit}
				/>
			);

		case "CONVERSATION_HISTORY":
			return <ConversationHistoryPage />;

		default: {
			return <HomePage onStartConversation={() => {}} />;
		}
	}
};
