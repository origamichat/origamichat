import type { Message as MessageType } from "@cossistant/types";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { useRenderElement } from "../utils/use-render-element";

export interface MessageRenderProps {
	isVisitor: boolean;
	isAI: boolean;
	isHuman: boolean;
	timestamp: Date;
	bodyMd: string;
	senderType: "visitor" | "ai" | "human";
}

export interface MessageProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: React.ReactNode | ((props: MessageRenderProps) => React.ReactNode);
	asChild?: boolean;
	className?: string;
	message: MessageType;
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
	({ children, className, asChild = false, message, ...props }, ref) => {
		// Determine sender type from message properties
		const isVisitor = message.visitorId !== null;
		const isAI = message.aiAgentId !== null;
		const isHuman = message.userId !== null && !isVisitor;

		const senderType = isVisitor ? "visitor" : isAI ? "ai" : "human";

		const renderProps: MessageRenderProps = {
			isVisitor,
			isAI,
			isHuman,
			timestamp: new Date(message.createdAt),
			bodyMd: message.bodyMd,
			senderType,
		};

		const messageContent =
			typeof children === "function" ? children(renderProps) : children;

		return useRenderElement(
			"div",
			{
				className,
				asChild,
			},
			{
				ref,
				state: renderProps,
				props: {
					role: "article",
					"aria-label": `Message from ${
						isVisitor ? "visitor" : isAI ? "AI assistant" : "human agent"
					}`,
					...props,
					children: messageContent,
				},
			}
		);
	}
);

Message.displayName = "Message";

const MemoizedMarkdownBlock = React.memo(
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

export interface MessageContentProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: React.ReactNode | ((content: string) => React.ReactNode);
	asChild?: boolean;
	className?: string;
	bodyMd?: string;
	renderMarkdown?: boolean;
}

export const MessageContent = React.forwardRef<
	HTMLDivElement,
	MessageContentProps
>(
	(
		{
			children,
			className,
			asChild = false,
			bodyMd = "",
			renderMarkdown = true,
			...props
		},
		ref
	) => {
		const messageContent = React.useMemo(() => {
			if (typeof children === "function") {
				return children(bodyMd);
			}
			if (children) {
				return children;
			}
			if (renderMarkdown && bodyMd) {
				return <MemoizedMarkdownBlock content={bodyMd} />;
			}
			return bodyMd;
		}, [children, bodyMd, renderMarkdown]);

		return useRenderElement(
			"div",
			{
				className,
				asChild,
			},
			{
				ref,
				props: {
					...props,
					children: messageContent,
				},
			}
		);
	}
);

MessageContent.displayName = "MessageContent";

export interface MessageTimestampProps
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
	children?: React.ReactNode | ((timestamp: Date) => React.ReactNode);
	asChild?: boolean;
	className?: string;
	timestamp: Date;
	format?: (date: Date) => string;
}

export const MessageTimestamp = React.forwardRef<
	HTMLSpanElement,
	MessageTimestampProps
>(
	(
		{
			children,
			className,
			asChild = false,
			timestamp,
			format = (date) =>
				date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			...props
		},
		ref
	) => {
		const content =
			typeof children === "function"
				? children(timestamp)
				: children || format(timestamp);

		return useRenderElement(
			"span",
			{
				className,
				asChild,
			},
			{
				ref,
				props: {
					...props,
					children: content,
				},
			}
		);
	}
);

MessageTimestamp.displayName = "MessageTimestamp";
