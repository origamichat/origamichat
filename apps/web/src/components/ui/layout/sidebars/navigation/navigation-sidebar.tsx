"use client";

import { Header } from "@cossistant/react/support/components/header";
import { LayoutDashboard, MoreHorizontal, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ConversationsList } from "@/app/(dashboard)/[websiteSlug]/(sidebars)/conversations.client";
import Icon from "@/components/ui/icons";
import { Logo } from "../../../logo";
import { SidebarContainer } from "../container";
import { ResizableSidebar } from "../resizable-sidebar";
import { SidebarItem } from "../sidebar-item";

// Removed mock conversations; now using live data

interface NavigationSidebarProps {
	websiteSlug: string;
	websiteId: string;
}

export function NavigationSidebar({
	websiteSlug,
	websiteId,
}: NavigationSidebarProps) {
	const pathname = usePathname();
	const scrollRef = useRef<HTMLDivElement | null>(null);

	return (
		<ResizableSidebar position="left">
			<SidebarContainer>
				<Header className="flex items-center px-3.5">
					<Logo className="text-primary" />
				</Header>

				<div className="flex h-full flex-col gap-1 overflow-hidden">
					<nav className="mb-2 flex flex-col gap-1 px-2 py-4">
						<SidebarItem
							active={pathname === `/${websiteSlug}`}
							href={`/${websiteSlug}`}
							iconName="dashboard"
						>
							Dashboard
						</SidebarItem>
						<SidebarItem
							active={pathname === `/${websiteSlug}/agents`}
							href={`/${websiteSlug}/agents`}
							iconName="agent"
						>
							Agents
						</SidebarItem>
					</nav>

					<div
						className="scrollbar-thin scrollbar-thumb-background-500 scrollbar-track-background-500 flex-1 overflow-y-auto px-2"
						ref={scrollRef}
					>
						<h4 className="px-2 text-primary/60 text-xs tracking-wider">
							Conversations
						</h4>
						<ConversationsList
							scrollContainerRef={
								scrollRef as React.RefObject<HTMLDivElement | null>
							}
							websiteId={websiteId}
							// Narrow the ref type to the non-null expectation for the prop
							websiteSlug={websiteSlug}
						/>
					</div>
				</div>

				<div className="h-14 p-2" />
			</SidebarContainer>
		</ResizableSidebar>
	);
}
