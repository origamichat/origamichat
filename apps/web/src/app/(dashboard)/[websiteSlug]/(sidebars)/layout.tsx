import { CentralBlock } from "@/components/ui/layout";
import { ConversationSidebar } from "@/components/ui/layout/sidebars/conversation-sidebar";
import { NavigationSidebar } from "@/components/ui/layout/sidebars/navigation-sidebar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<NavigationSidebar />
			<CentralBlock>{children}</CentralBlock>
			{/* <ConversationSidebar /> */}
		</div>
	);
}
