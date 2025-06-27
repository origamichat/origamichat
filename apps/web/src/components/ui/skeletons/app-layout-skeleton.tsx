import { Logo } from "../logo";
import { SidebarContainer } from "../sidebars/container";

export function AppLayoutSkeleton() {
	return (
		<div className="pointer-events-none h-screen w-screen">
			<SidebarContainer>
				<div className="flex h-10 items-center justify-between px-2">
					<Logo className="text-primary/5" />
				</div>
			</SidebarContainer>
		</div>
	);
}
