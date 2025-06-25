import { Logo } from "../logo";
import { SidebarContainer } from "./container";
import { ResizableSidebar } from "./resizable-sidebar";

export function NavigationSidebar() {
  return (
    <ResizableSidebar position="left">
      <SidebarContainer>
        <div className="flex h-10 items-center justify-between px-2">
          <Logo className="text-primary" />
          {/* <div className="flex items-center gap-2">
          <ModeToggle />
        </div> */}
        </div>
      </SidebarContainer>
    </ResizableSidebar>
  );
}
