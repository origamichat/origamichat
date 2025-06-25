"use client";
import { type ReactNode, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  MAX_SIDEBAR_WIDTH,
  type SidebarPosition,
  useSidebar,
} from "@/hooks/use-sidebars";
import { cn } from "@/lib/utils";
import { TooltipOnHover } from "../tooltip";

type ResizableSidebarProps = {
  className?: string;
  children: ReactNode;
  position: SidebarPosition;
};

export const ResizableSidebar = ({
  className,
  children,
  position,
}: ResizableSidebarProps) => {
  const { width, setWidth, open, toggle } = useSidebar({ position });

  return (
    <>
      <aside
        className={cn(
          "relative flex h-screen max-h-screen border-transparent p-0",
          className,
          {
            "ml-[3px] p-0": !open,
          }
        )}
        style={{
          width: open ? width : 0,
          minWidth: open ? width : 0,
          maxWidth: open ? width : MAX_SIDEBAR_WIDTH,
        }}
      >
        {open && (
          <>
            {children}
            <SidebarHandle
              isCollapsed={!open}
              onResize={setWidth}
              onToggle={toggle}
            />
          </>
        )}
      </aside>
      {!open && (
        <SidebarHandle
          isCollapsed={!open}
          onResize={setWidth}
          onToggle={toggle}
        />
      )}
    </>
  );
};

type SidebarHandleProps = {
  isCollapsed?: boolean;
  onToggle: () => void;
  onResize: (deltaX: number) => void;
  hotkeys?: string[];
  position?: "left" | "right";
  onClose?: () => void;
};

const SidebarHandle = ({
  isCollapsed,
  onToggle,
  onResize,
  hotkeys = ["shift", "s"],
  position = "right",
  onClose,
}: SidebarHandleProps) => {
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const initialStartX = e.clientX;
      let startX = e.clientX;

      document.body.style.userSelect = "none"; // Re-enable text selection

      const onMouseMove = (_e: MouseEvent) => {
        const deltaX =
          position === "right" ? _e.clientX - startX : startX - _e.clientX;

        if (!isCollapsed) {
          onResize(deltaX);
        }

        startX = _e.clientX; // Update startX to the current mouse position
      };

      const onMouseUp = (_e: MouseEvent) => {
        // It's a click
        if (initialStartX === _e.clientX) {
          onToggle();

          if (onClose && !isCollapsed) {
            onClose();
          }
        }

        document.body.style.userSelect = ""; // Re-enable text selection

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onToggle, onResize, onClose, isCollapsed, position]
  );

  // Open the open on key stroke
  useHotkeys(
    [hotkeys.join("+")],
    () => {
      onToggle();
    },
    {
      preventDefault: true,
    }
  );

  const tooltipContent = isCollapsed ? (
    "Click to open"
  ) : (
    <div className="flex flex-col gap-1">
      <span>Click to collapse</span>
      <span>Drag to resize</span>
    </div>
  );

  return (
    <button
      className={cn(
        "relative z-10 hidden max-h-screen w-auto items-center justify-center bg-transparent md:flex",
        position === "right" ? "-right-[6px]" : "-left-[6px]",
        {
          "-right-[14px] absolute top-0 bottom-0":
            !isCollapsed && position === "right",
          "-left-[10px] absolute top-0 bottom-0":
            !isCollapsed && position === "left",
        }
      )}
      onMouseDown={onMouseDown}
      type="button"
    >
      <div className="group flex h-full items-center justify-center hover:cursor-col-resize">
        <TooltipOnHover
          content={tooltipContent}
          shortcuts={hotkeys}
          side="right"
        >
          <div className="h-fit w-4 flex-col items-center justify-center bg-transparent hover:cursor-pointer">
            {position === "right" ? (
              <>
                <div
                  className={cn(
                    "-mb-[3px] h-4 w-[3px] rounded-sm bg-background-500 transition-all group-hover:h-6 group-hover:rotate-6 group-hover:bg-background-600",
                    {
                      "group-hover:-rotate-6": isCollapsed,
                    }
                  )}
                />
                <div
                  className={cn(
                    "-mt-[3px] group-hover:-rotate-6 h-4 w-[3px] rounded-sm bg-background-500 transition-all group-hover:h-6 group-hover:bg-background-600",
                    {
                      "group-hover:rotate-6": isCollapsed,
                    }
                  )}
                />
              </>
            ) : (
              <>
                <div
                  className={cn(
                    "-mb-[3px] group-hover:-rotate-6 h-4 w-[3px] rounded-sm bg-background-500 transition-all group-hover:h-6 group-hover:bg-background-600",
                    {
                      "group-hover:-rotate-6": isCollapsed,
                    }
                  )}
                />
                <div
                  className={cn(
                    "-mt-[3px] h-4 w-[3px] rounded-sm bg-background-500 transition-all group-hover:h-6 group-hover:rotate-6 group-hover:bg-background-600",
                    {
                      "group-hover:rotate-6": isCollapsed,
                    }
                  )}
                />
              </>
            )}
          </div>
        </TooltipOnHover>
      </div>
    </button>
  );
};
