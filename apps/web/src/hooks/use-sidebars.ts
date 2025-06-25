import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const MIN_SIDEBAR_WIDTH = 240;
export const DEFAULT_SIDEBAR_WIDTH = 288;
export const MAX_SIDEBAR_WIDTH = 480;

export type SidebarPosition = "left" | "right";

type SidebarsState = {
  leftSidebarWidth: number;
  leftSidebarOpen: boolean;
  rightSidebarWidth: number;
  rightSidebarOpen: boolean;
  setLeftSidebarWidth: (width: number) => void;
  setRightSidebarWidth: (width: number) => void;
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
      leftSidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      rightSidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      setLeftSidebarWidth: (width) =>
        set((state) => ({
          leftSidebarWidth: Math.min(
            Math.max(width + state.leftSidebarWidth, MIN_SIDEBAR_WIDTH),
            MAX_SIDEBAR_WIDTH
          ),
        })),
      setRightSidebarWidth: (width) =>
        set((state) => ({
          rightSidebarWidth: Math.min(
            Math.max(width + state.rightSidebarWidth, MIN_SIDEBAR_WIDTH),
            MAX_SIDEBAR_WIDTH
          ),
        })),
    }),
    {
      name: "sidebars-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useSidebar({ position }: { position: SidebarPosition }) {
  const {
    leftSidebarWidth,
    rightSidebarWidth,
    setLeftSidebarWidth,
    setRightSidebarWidth,
    leftSidebarOpen,
    rightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useSidebarsState();

  if (position === "left") {
    return {
      width: leftSidebarWidth,
      setWidth: setLeftSidebarWidth,
      open: leftSidebarOpen,
      toggle: toggleLeftSidebar,
    };
  }

  return {
    width: rightSidebarWidth,
    setWidth: setRightSidebarWidth,
    open: rightSidebarOpen,
    toggle: toggleRightSidebar,
  };
}
