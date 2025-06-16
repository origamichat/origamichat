import { ModeToggle } from "@/components/theme-toggle";
import { Logo } from "../logo";
import { SidebarContainer } from "./container";

export function NavigationSidebar() {
  return (
    <SidebarContainer>
      <div className="flex items-center justify-between h-10 px-2">
        <Logo className="text-primary" />
        {/* <div className="flex items-center gap-2">
          <ModeToggle />
        </div> */}
      </div>
    </SidebarContainer>
  );
}
