import { Header } from "@cossistant/react/support/components/header";
import { ChevronDown } from "lucide-react";
import { Button } from "../../button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Logo } from "../../logo";
import { SidebarContainer } from "./container";
import { ResizableSidebar } from "./resizable-sidebar";

export function NavigationSidebar() {
	return (
		<ResizableSidebar position="left">
			<SidebarContainer>
				<Header className="flex items-center">
					<Logo className="text-primary" />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="ghost">
								Select Workspace
								<ChevronDown className="ml-auto" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[--radix-popper-anchor-width]">
							<DropdownMenuItem>
								<span>Acme Inc</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<span>Acme Corp.</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</Header>
				<div className="scrollbar-thin scrollbar-thumb-background-500 scrollbar-track-background-500 flex h-full flex-col gap-2 overflow-y-auto">
					<p>hello</p>
				</div>
				<div className="flex h-14 flex-col gap-2 bg-amber-500">
					<p>footer</p>
				</div>
			</SidebarContainer>
		</ResizableSidebar>
	);
}
