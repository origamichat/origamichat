"use client";

import { Header } from "@cossistant/react/support/components/header";
import { LayoutDashboard, MoreHorizontal, Users } from "lucide-react";
import { usePathname } from "next/navigation";

import { Logo } from "../../logo";
import { SidebarContainer } from "./container";
import { ConversationItem } from "./conversation-item";
import { ResizableSidebar } from "./resizable-sidebar";
import { SidebarItem } from "./sidebar-item";

const mockConversations = [
	{
		id: "1",
		name: "Sarah Chen",
		avatar: "https://i.pravatar.cc/150?u=sarah",
		lastMessage: "Thanks for the help with the integration!",
		time: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
		unread: true,
		online: true,
	},
	{
		id: "2",
		name: "Michael Rodriguez",
		avatar: "https://i.pravatar.cc/150?u=michael",
		lastMessage: "Is there a way to customize the widget colors?",
		time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
		unread: true,
		online: true,
	},
	{
		id: "3",
		name: "Emma Thompson",
		avatar: "https://i.pravatar.cc/150?u=emma",
		lastMessage: "Got it working, appreciate the quick response",
		time: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
		unread: false,
		online: false,
	},
	{
		id: "4",
		name: "James Wilson",
		avatar: "https://i.pravatar.cc/150?u=james",
		lastMessage: "The API documentation link seems broken",
		time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		unread: false,
		online: true,
	},
	{
		id: "5",
		name: "Lisa Park",
		avatar: "https://i.pravatar.cc/150?u=lisa",
		lastMessage: "Perfect, that solved my issue!",
		time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
		unread: false,
		online: false,
	},
	{
		id: "6",
		name: "David Kumar",
		avatar: "https://i.pravatar.cc/150?u=david",
		lastMessage: "Can you help me with webhook setup?",
		time: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
		unread: false,
		online: true,
	},
];

interface NavigationSidebarProps {
	websiteSlug: string;
}

export function NavigationSidebar({ websiteSlug }: NavigationSidebarProps) {
	const pathname = usePathname();

	return (
		<ResizableSidebar position="left">
			<SidebarContainer>
				<Header className="flex items-center pr-0">
					<Logo className="mx-0.5 text-primary" />
				</Header>

				<div className="flex h-full flex-col gap-1 overflow-hidden">
					<nav className="px-2 py-2">
						<SidebarItem
							active={pathname === `/${websiteSlug}`}
							href={`/${websiteSlug}`}
							icon={<LayoutDashboard className="size-4" />}
						>
							Dashboard
						</SidebarItem>
						<SidebarItem
							active={pathname === `/${websiteSlug}/agents`}
							href={`/${websiteSlug}/agents`}
							icon={<Users className="size-4" />}
						>
							Agents
						</SidebarItem>
					</nav>

					<div className="px-4 py-2">
						<h3 className="font-semibold text-[10px] text-primary/60 uppercase tracking-wider">
							Conversations
						</h3>
					</div>

					<div className="scrollbar-thin scrollbar-thumb-background-500 scrollbar-track-background-500 flex-1 overflow-y-auto px-2">
						<div className="flex flex-col gap-1">
							{mockConversations.map((conversation) => (
								<ConversationItem
									active={
										pathname ===
										`/${websiteSlug}/conversations/${conversation.id}`
									}
									avatar={conversation.avatar}
									href={`/${websiteSlug}/conversations/${conversation.id}`}
									key={conversation.id}
									lastMessage={conversation.lastMessage}
									name={conversation.name}
									online={conversation.online}
									time={conversation.time}
									unread={conversation.unread}
								/>
							))}
						</div>
					</div>
				</div>

				<div className="border-t p-2">
					<SidebarItem
						className="text-xs"
						icon={<MoreHorizontal className="size-4" />}
						onClick={() => console.log("Settings clicked")}
					>
						More options
					</SidebarItem>
				</div>
			</SidebarContainer>
		</ResizableSidebar>
	);
}
