import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@cossistant/react/primitive/avatar";
import type {
	ConversationEvent,
	Message as MessageType,
	SenderType,
} from "@cossistant/types";
import type React from "react";
import { useEffect, useState } from "react";
import { useSupport } from "../..";
import { MessageList } from "../components/message-list";
import { MultimodalInput } from "../components/multimodal-input";
import { cn } from "../utils";

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
	events: ConversationEvent[];

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
}) => {
	const { website } = useSupport();
	const [isScrolled, setIsScrolled] = useState(false);

	const availableAgents = website?.availableHumanAgents || [];
	const availableAIAgents = website?.availableAIAgents || [];

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
				availableAIAgents={availableAIAgents}
				availableHumanAgents={availableAgents}
				className="min-h-0 flex-1"
				events={events}
				messages={messages}
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
