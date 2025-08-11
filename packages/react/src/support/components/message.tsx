import type { Message as MessageType } from "@cossistant/types";
import type React from "react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "../utils";

const MemoizedMarkdownBlock = memo(
	({ content }: { content: string }) => {
		return <ReactMarkdown>{content}</ReactMarkdown>;
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) {
			return false;
		}
		return true;
	}
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export interface MessageProps {
	message: MessageType;
	senderName?: string;
	isLast?: boolean;
}

export function Message({ message, senderName, isLast = false }: MessageProps) {
	const isVisitor = message.visitorId !== null;
	const isAI = message.aiAgentId !== null;

	return (
		<div
			className={cn(
				"flex gap-2",
				isVisitor && "flex-row-reverse",
				!isVisitor && "flex-row"
			)}
		>
			<div
				className={cn(
					"flex w-fit max-w-[85%] flex-col gap-1 overflow-clip",
					isVisitor && "items-end"
				)}
			>
				<div
					className={cn(
						"rounded-lg px-3 py-2 text-sm",
						isVisitor && "rounded-br-sm bg-primary text-primary-foreground",
						!isVisitor &&
							"rounded-bl-sm bg-co-background-200 text-foreground dark:bg-co-background-500"
					)}
				>
					<MemoizedMarkdownBlock content={message.content} />
				</div>
				{isLast && (
					<span className="px-1 text-muted-foreground text-xs">
						{new Date(message.createdAt).toLocaleTimeString([], {
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
