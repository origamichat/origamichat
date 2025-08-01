import { CentralBlock } from "@/components/ui/layout";
import { ConversationSidebar } from "@/components/ui/layout/sidebars/conversation-sidebar";
import { NavigationSidebar } from "@/components/ui/layout/sidebars/navigation-sidebar";
import { ensureWebsiteAccess } from "@/lib/auth/website-access";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{
		websiteSlug: string;
	}>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const { websiteSlug } = await params;
	await ensureWebsiteAccess(websiteSlug);

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<NavigationSidebar websiteSlug={websiteSlug} />
			<CentralBlock>{children}</CentralBlock>
			{/* <ConversationSidebar /> */}
		</div>
	);
}
