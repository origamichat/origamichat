import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
