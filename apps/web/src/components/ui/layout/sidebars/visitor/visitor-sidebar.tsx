import { SidebarContainer } from "../container";
import { ResizableSidebar } from "../resizable-sidebar";

export function ConversationSidebar() {
	return (
		<ResizableSidebar position="right">
			<SidebarContainer>ConversationSidebar</SidebarContainer>
		</ResizableSidebar>
	);
}
