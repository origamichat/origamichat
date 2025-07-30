import { Page } from "@/components/ui/layout";
import { Header } from "@/components/ui/layout/header";
import { ensureWebsiteAccess } from "@/lib/auth/website-access";

interface DashboardPageProps {
	params: Promise<{
		websiteSlug: string;
	}>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
	const { websiteSlug } = await params;
	const { user, website } = await ensureWebsiteAccess(websiteSlug);

	return (
		<>
			<Header />
			<Page>
				<p>Welcome to {website?.name} dashboard!</p>
				<p>You have access as: {user.name}</p>
			</Page>
		</>
	);
}
