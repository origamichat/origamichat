import type { Message as MessageType } from "@cossistant/types";
import * as React from "react";
import { useRenderElement } from "../utils/use-render-element";

export interface MessageGroupRenderProps {
	isVisitor: boolean;
	isAI: boolean;
	isHuman: boolean;
	messageCount: number;
	senderType: "visitor" | "ai" | "human";
	senderId?: string | null;
}

export interface MessageGroupProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?:
		| React.ReactNode
		| ((props: MessageGroupRenderProps) => React.ReactNode);
	asChild?: boolean;
	className?: string;
	messages: MessageType[];
}

export const MessageGroup = React.forwardRef<HTMLDivElement, MessageGroupProps>(
	({ children, className, asChild = false, messages = [], ...props }, ref) => {
		// Determine sender type from first message in group
		const firstMessage = messages[0];
		const isVisitor = firstMessage ? firstMessage.visitorId !== null : false;
		const isAI = firstMessage ? firstMessage.aiAgentId !== null : false;
		const isHuman = firstMessage
			? firstMessage.userId !== null && !isVisitor
			: false;
		const senderType = isVisitor ? "visitor" : isAI ? "ai" : "human";

		const senderId = isVisitor
			? firstMessage?.visitorId
			: isAI
				? firstMessage?.aiAgentId
				: firstMessage?.userId;

		const renderProps: MessageGroupRenderProps = {
			isVisitor,
			isAI,
			isHuman,
			messageCount: messages.length,
			senderType,
			senderId: senderId || undefined,
		};

		const content =
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
					role: "group",
					"aria-label": `Message group from ${senderType}`,
					...props,
					children: content,
				},
			}
		);
	}
);

MessageGroup.displayName = "MessageGroup";

export interface MessageGroupAvatarProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export const MessageGroupAvatar = React.forwardRef<
	HTMLDivElement,
	MessageGroupAvatarProps
>(({ children, className, asChild = false, ...props }, ref) => {
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
				children,
			},
		}
	);
});

MessageGroupAvatar.displayName = "MessageGroupAvatar";

export interface MessageGroupHeaderProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: React.ReactNode | ((name?: string) => React.ReactNode);
	asChild?: boolean;
	className?: string;
	name?: string;
}

export const MessageGroupHeader = React.forwardRef<
	HTMLDivElement,
	MessageGroupHeaderProps
>(({ children, className, asChild = false, name, ...props }, ref) => {
	const content = typeof children === "function" ? children(name) : children;

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
				children: content,
			},
		}
	);
});

MessageGroupHeader.displayName = "MessageGroupHeader";

export interface MessageGroupContentProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: React.ReactNode;
	asChild?: boolean;
	className?: string;
}

export const MessageGroupContent = React.forwardRef<
	HTMLDivElement,
	MessageGroupContentProps
>(({ children, className, asChild = false, ...props }, ref) => {
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
				children,
			},
		}
	);
});

MessageGroupContent.displayName = "MessageGroupContent";
