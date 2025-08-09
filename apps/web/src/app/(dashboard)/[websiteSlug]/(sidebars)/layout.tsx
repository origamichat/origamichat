import { CentralBlock } from "@/components/ui/layout";
import { NavigationSidebar } from "@/components/ui/layout/sidebars/navigation/navigation-sidebar";
import { ConversationSidebar } from "@/components/ui/layout/sidebars/visitor/visitor-sidebar";
import { ensureWebsiteAccess } from "@/lib/auth/website-access";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{
		websiteSlug: string;
	}>;
}

export default async function Layout({ children, params }: LayoutProps) {
	const { websiteSlug } = await params;
	const { website } = await ensureWebsiteAccess(websiteSlug);

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			{website ? (
				<NavigationSidebar websiteId={website.id} websiteSlug={websiteSlug} />
			) : null}
			<CentralBlock>{children}</CentralBlock>
			{/* <ConversationSidebar /> */}
		</div>
	);
}
