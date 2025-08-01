import { SidebarProvider } from "@/components/ui/sidebar";
import { source } from "@/lib/source";
import { DocsSidebar } from "../components/docs/docs-sidebar";

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col px-2">
			<SidebarProvider className="3xl:fixed:container min-h-min flex-1 items-start 3xl:fixed:px-3 px-0 [--sidebar-width:220px] [--top-spacing:0] lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] lg:[--sidebar-width:240px] lg:[--top-spacing:calc(var(--spacing)*4)]">
				<DocsSidebar tree={source.pageTree} />
				<div className="h-full w-full">{children}</div>
			</SidebarProvider>
		</div>
	);
}
