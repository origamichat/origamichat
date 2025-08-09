"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 60) {
		return `${diffMins}m`;
	}
	if (diffHours < 24) {
		return `${diffHours}h`;
	}
	return `${diffDays}d`;
}

interface ConversationItemProps {
	href: string;
	avatar?: string;
	name: string;
	lastMessage: string;
	time?: Date;
	unread?: boolean;
	active?: boolean;
	online?: boolean;
	className?: string;
}

export function ConversationItem({
	href,
	avatar,
	name,
	lastMessage,
	time,
	unread = false,
	active = false,
	online = false,
	className,
}: ConversationItemProps) {
	return (
		<Link
			className={cn(
				"group/conversation-item relative flex items-center gap-3 rounded-[2px] px-3 py-2 transition-colors",
				"hover:bg-os-background-400 hover:text-primary",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				active && "bg-background-400 text-accent-foreground",
				className
			)}
			href={href}
		>
			<div className="relative">
				<Avatar className="size-6 shrink-0">
					<AvatarImage alt={name} src={avatar} />
					<AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
				{online && (
					<div className="absolute right-0 bottom-0 size-1 rounded-[1px] bg-co-blue ring-2 ring-background group-hover/conversation-item:ring-background-400" />
				)}
			</div>

			<div className="min-w-0 flex-1">
				<div className="mb-0.5 flex items-baseline justify-between gap-2">
					<h4
						className={cn(
							"truncate font-medium text-xs",
							unread && "font-semibold"
						)}
					>
						{name}
					</h4>
					{time && (
						<span className="shrink-0 text-muted-foreground text-xs">
							{formatTimeAgo(time)}
						</span>
					)}
				</div>
				<p
					className={cn(
						"truncate pr-6 text-muted-foreground text-xs",
						unread && "font-medium text-foreground"
					)}
				>
					{lastMessage}
				</p>
			</div>
		</Link>
	);
}
