import type React from "react";
import { useSupportNavigation } from "./context/navigation";
import { ConversationPage } from "./pages/conversation";
import { ConversationHistoryPage } from "./pages/conversation-history";
import { FAQPage } from "./pages/faq";
import { HomePage } from "./pages/home";

export const SupportRouter: React.FC = () => {
	const { current } = useSupportNavigation();

	switch (current.page) {
		case "HOME":
			return <HomePage />;

		case "FAQ":
			return <FAQPage />;

		case "CONVERSATION":
			// TypeScript knows current.params exists and has conversationId here
			return (
				<ConversationPage conversationId={current.params.conversationId} />
			);

		case "CONVERSATION_HISTORY":
			return <ConversationHistoryPage />;

		default: {
			// Exhaustive check ensures we handle all cases
			const _exhaustive: never = current;
			return <HomePage />;
		}
	}
};
