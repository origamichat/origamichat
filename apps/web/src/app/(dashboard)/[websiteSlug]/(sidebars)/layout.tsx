import { NavigationSidebar } from "@/components/ui/sidebars/navigation-sidebar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className="flex h-screen w-screen">
			<NavigationSidebar />
			{children}
		</section>
	);
}
