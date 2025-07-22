import type React from "react";
import { Container } from "../components/container";
import { Header } from "../components/header";
import { useSupportNavigation } from "../context/navigation";

export const ConversationHistoryPage: React.FC = () => {
	const { goBack, canGoBack } = useSupportNavigation();

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
					<span className="font-medium text-sm">Conversation History</span>
				</div>
			</Header>
			<Container>
				<p>ConversationHistoryPage</p>
			</Container>
		</>
	);
};
