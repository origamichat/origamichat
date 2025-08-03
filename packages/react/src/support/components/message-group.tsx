import type { Message as MessageType } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { cn } from "../utils";
import { CossistantLogo } from "./cossistant-branding";
import { Message } from "./message";

export interface MessageGroupProps {
	messages: MessageType[];
	senderName?: string;
	senderImage?: string;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({
	messages,
	senderName,
	senderImage,
}) => {
	if (messages.length === 0) {
		return null;
	}

	const isVisitor = messages[0]?.sender === SenderType.VISITOR;
	const isAI = messages[0]?.sender === SenderType.AI;
	const showAvatar = !isVisitor;

	return (
		<div
			className={cn(
				"flex gap-2",
				isVisitor && "flex-row-reverse",
				!isVisitor && "flex-row"
			)}
		>
			{/* Avatar positioned at bottom of group for non-visitor messages */}
			{showAvatar && (
				<div className="flex flex-col justify-end">
					{isAI ? (
						<div className="flex size-8 items-center justify-center rounded bg-primary/10">
							<CossistantLogo className="h-5 w-5 text-primary" />
						</div>
					) : (
						<Avatar className="size-8 flex-shrink-0 overflow-clip rounded">
							{senderImage && (
								<AvatarImage alt={senderName} src={senderImage} />
							)}
							<AvatarFallback
								className="text-xs"
								name={senderName || "Support"}
							/>
						</Avatar>
					)}
				</div>
			)}

			{/* Spacer for visitor messages to maintain alignment */}
			{!showAvatar && isVisitor && <div className="w-8" />}

			{/* Messages column */}
			<div className={cn("flex flex-col gap-1", isVisitor && "items-end")}>
				{/* Sender name shown at top of group */}
				{showAvatar && (senderName || isAI) && (
					<span className="px-1 text-muted-foreground text-xs">
						{isAI ? "Cossistant AI" : senderName}
					</span>
				)}

				{/* All messages in the group */}
				{messages.map((message, index) => (
					<Message
						isLast={index === messages.length - 1}
						key={message.id}
						message={message}
						showAvatar={false} // Avatar is handled by the group
						showSenderName={false} // Sender name is handled by the group
					/>
				))}
			</div>
		</div>
	);
};
