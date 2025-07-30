"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { source } from "@/lib/source";

export function DocsSidebar({
	tree,
	...props
}: React.ComponentProps<typeof Sidebar> & { tree: typeof source.pageTree }) {
	const pathname = usePathname();

	return (
		<Sidebar
			className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] bg-transparent lg:flex"
			collapsible="none"
			{...props}
		>
			<SidebarContent className="no-scrollbar px-0 pb-12">
				<div className="h-(--top-spacing) shrink-0" />
				{tree.children.map((item) => (
					<SidebarGroup key={item.$id}>
						<SidebarGroupLabel className="font-medium text-muted-foreground">
							{item.name}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							{item.type === "folder" && (
								<SidebarMenu className="gap-0.5">
									{item.children.map((subItem) => {
										return (
											subItem.type === "page" && (
												<SidebarMenuItem key={subItem.url}>
													<SidebarMenuButton
														asChild
														className="after:-inset-y-1 relative h-[30px] 3xl:fixed:w-full w-fit 3xl:fixed:max-w-48 overflow-visible border border-transparent font-medium text-[0.8rem] after:absolute after:inset-x-0 after:z-0 after:rounded data-[active=true]:border-accent data-[active=true]:bg-accent"
														isActive={subItem.url === pathname}
													>
														<Link href={subItem.url}>{subItem.name}</Link>
													</SidebarMenuButton>
												</SidebarMenuItem>
											)
										);
									})}
								</SidebarMenu>
							)}
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}
