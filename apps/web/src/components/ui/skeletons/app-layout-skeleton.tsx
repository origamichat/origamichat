import { Logo } from "../logo";
import { SidebarContainer } from "../sidebars/container";

export function AppLayoutSkeleton() {
  return (
    <div className="h-screen w-screen pointer-events-none">
      <SidebarContainer>
        <div className="flex items-center justify-between h-10 px-2">
          <Logo className="text-primary/5" />
        </div>
      </SidebarContainer>
    </div>
  );
}
