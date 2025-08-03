import type { Message as MessageType, SenderType } from "@cossistant/types";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSupport } from "../..";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { Container } from "../components/container";
import { MessageList } from "../components/message-list";
import { MultimodalInput } from "../components/multimodal-input";
import { useSupportConfig } from "../context/config";
import { cn } from "../utils";

export interface HomePageProps {
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
	isTyping?: {
		type: SenderType;
	};
	currentTypingUser?: SenderType | null;
}

export const HomePage: React.FC<HomePageProps> = ({
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
	isTyping,
	currentTypingUser,
}) => {
	const { website } = useSupport();
	const [isScrolled, setIsScrolled] = useState(false);

	const availableAgents = website?.availableAgents || [];

	// Set up scroll listener for the message-list element
	useEffect(() => {
		const messageListElement = document.getElementById("message-list");

		if (!messageListElement) {
			return;
		}

		const handleScroll = () => {
			setIsScrolled(messageListElement.scrollTop > 0);
		};

		messageListElement.addEventListener("scroll", handleScroll);

		// Cleanup listener on unmount
		return () => {
			messageListElement.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="flex h-full flex-col gap-0 overflow-hidden">
			<div
				className={cn(
					"flex-shrink-0 border-co-border border-b bg-co-background px-2 pt-0 shadow-xs transition-all duration-200",
					isScrolled && ""
				)}
			>
				<div className="flex items-center gap-2 px-2 py-3">
					{availableAgents.map((agent) => (
						<Avatar
							className="flex size-8 items-center justify-center overflow-clip rounded bg-co-background-200"
							key={agent.id}
						>
							{agent.image && (
								<AvatarImage alt={agent.name} src={agent.image} />
							)}
							<AvatarFallback className="text-xs" name={agent.name} />
						</Avatar>
					))}
					<div className="flex flex-col">
						<p className="font-medium text-sm">{website?.name}</p>
						<p className="text-muted-foreground text-sm">Online</p>
					</div>
				</div>
			</div>

			<MessageList
				availableAgents={availableAgents}
				className="min-h-0 flex-1"
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

			<div className="flex-shrink-0 px-2 pb-2">
				<MultimodalInput
					disabled={isSubmitting}
					error={error}
					files={files}
					isSubmitting={isSubmitting}
					onChange={setMessage}
					onFileSelect={addFiles}
					onRemoveFile={removeFile}
					onSubmit={submit}
					placeholder="Type your message..."
					value={message}
				/>
			</div>
		</div>
	);
};
