import type React from "react";
import { useState } from "react";
import {
	Footer,
	Input,
	InputContainer,
	InputWrapper,
	SendButton,
} from "../components";

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
	const [value, setValue] = useState("");
	const [messages, setMessages] = useState<
		Array<{ id: string; text: string; sender: "user" | "support" }>
	>([
		{
			id: "1",
			text: `Welcome to conversation ${conversationId}`,
			sender: "support",
		},
	]);

	const handleSubmit = () => {
		if (value.trim()) {
			setMessages([
				...messages,
				{
					id: Date.now().toString(),
					text: value,
					sender: "user",
				},
			]);
			setValue("");
			// TODO: Send to backend
		}
	};

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
					{messages.map((message) => (
						<div
							className={`max-w-[70%] rounded-lg px-3 py-2 ${
								message.sender === "user"
									? "self-end bg-blue-600 text-white"
									: "self-start bg-gray-100 text-black"
							}`}
							key={message.id}
						>
							{message.text}
						</div>
					))}
				</div>
			</Container>
			<InputContainer>
				<InputWrapper>
					<Input
						onChange={setValue}
						onSubmit={handleSubmit}
						placeholder="Type your message..."
						value={value}
					/>
					<SendButton onClick={handleSubmit} />
				</InputWrapper>
				<Footer />
			</InputContainer>
		</>
	);
};
