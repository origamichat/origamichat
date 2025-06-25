import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const MIN_SIDEBAR_WIDTH = 240;
export const DEFAULT_SIDEBAR_WIDTH = 288;
export const MAX_SIDEBAR_WIDTH = 480;

export type SidebarPosition = "left" | "right";

type SidebarsState = {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleBothSidebars: () => void;
  closeBothSidebars: () => void;
  openBothSidebars: () => void;
};

export const useSidebarsState = create<SidebarsState>()(
  persist(
    (set, get) => ({
      leftSidebarOpen: true,
      rightSidebarOpen: true,
      toggleLeftSidebar: () => set({ leftSidebarOpen: !get().leftSidebarOpen }),
      toggleRightSidebar: () =>
        set({ rightSidebarOpen: !get().rightSidebarOpen }),
      toggleBothSidebars: () => {
        const { leftSidebarOpen, rightSidebarOpen } = get();
        // If both are open, close both. If any is closed, open both.
        const bothOpen = leftSidebarOpen && rightSidebarOpen;
        set({
          leftSidebarOpen: !bothOpen,
          rightSidebarOpen: !bothOpen,
        });
      },
      closeBothSidebars: () =>
        set({ leftSidebarOpen: false, rightSidebarOpen: false }),
      openBothSidebars: () =>
        set({ leftSidebarOpen: true, rightSidebarOpen: true }),
    }),
    {
      name: "sidebars-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useSidebar({ position }: { position: SidebarPosition }) {
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useSidebarsState();

  if (position === "left") {
    return {
      open: leftSidebarOpen,
      toggle: toggleLeftSidebar,
    };
  }

  return {
    open: rightSidebarOpen,
    toggle: toggleRightSidebar,
  };
}
