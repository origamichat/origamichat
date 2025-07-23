import type React from "react";
import { useState } from "react";

import { Container } from "../components/container";
import { Header } from "../components/header";

import { useSupportNavigation } from "../context/navigation";

interface ConversationPageProps {
	conversationId: string;
}

export const ConversationPage: React.FC<ConversationPageProps> = ({
	conversationId,
}) => {
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
					<span className="font-medium text-sm">
						Conversation {conversationId}
					</span>
				</div>
			</Header>
			<Container>
				<div className="flex flex-col gap-2.5">
					<div className="flex flex-col gap-2.5">
						<div className="flex flex-col gap-2.5" />
					</div>
				</div>
			</Container>
		</>
	);
};
