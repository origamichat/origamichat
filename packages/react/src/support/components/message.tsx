import type { Message as MessageType } from "@cossistant/types";
import { SenderType } from "@cossistant/types";
import { marked } from "marked";
import type React from "react";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitive";
import { cn } from "../utils";

function parseMarkdownIntoBlocks(markdown: string): string[] {
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

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

const MemoizedMarkdown = memo(
	({ content, id }: { content: string; id: string }) => {
		const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

		return blocks.map((block, index) => (
			<MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
		));
	}
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";

export interface MessageProps {
	message: MessageType;
	senderName?: string;
	isLast?: boolean;
}

export function Message({ message, senderName, isLast = false }: MessageProps) {
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
					<MemoizedMarkdown
						content={message.content}
						id={message.id || `message-${Date.now()}`}
					/>
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
