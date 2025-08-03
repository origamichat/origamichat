import type { Message as MessageType } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { cn } from "../utils";

export interface MessageProps {
	message: MessageType;
	senderName?: string;
	senderImage?: string;
	showAvatar?: boolean;
	showSenderName?: boolean;
	isLast?: boolean;
}

export function Message({
	message,
	senderName,
	senderImage,
	showAvatar = true,
	showSenderName = true,
	isLast = false,
}: MessageProps) {
	const isVisitor = message.sender === SenderType.VISITOR;
	const isAI = message.sender === SenderType.AI;

	return (
		<div
			className={cn(
				"flex gap-2",
				isVisitor && "flex-row-reverse",
				!isVisitor && "flex-row"
			)}
		>
			{showAvatar && !isVisitor && (
				<Avatar className="size-8 flex-shrink-0 rounded">
					{senderImage && <AvatarImage alt={senderName} src={senderImage} />}
					<AvatarFallback
						className="text-xs"
						name={senderName || (isAI ? "AI" : "Support")}
					/>
				</Avatar>
			)}
			{showAvatar && isVisitor && <div className="w-8" />}

			<div
				className={cn(
					"flex max-w-[90%] flex-col gap-1",
					isVisitor && "w-full items-end"
				)}
			>
				{showAvatar && showSenderName && !isVisitor && senderName && (
					<span className="px-1 text-muted-foreground text-xs">
						{senderName}
					</span>
				)}
				<div
					className={cn(
						"rounded-lg px-3 py-2 text-sm",
						isVisitor && "rounded-br-sm bg-primary text-primary-foreground",
						!isVisitor &&
							"rounded-bl-sm bg-co-background-200 text-foreground dark:bg-co-background-500"
					)}
				>
					<p className="whitespace-pre-wrap break-words">{message.content}</p>
				</div>
				{isLast && (
					<span className="px-1 text-muted-foreground text-xs">
						{new Date(message.timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
						{isAI && " • AI agent"}
					</span>
				)}
			</div>
		</div>
	);
}
