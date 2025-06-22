import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icons";

export const CommandShortcut = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<Omit<HTMLSpanElement, "children">> & {
  children: string[];
}) => {
  const isMac =
    typeof window !== "undefined" &&
    window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const renderShortcut = (children: string[]) => {
    return (
      <>
        {children.map((child) => {
          return (
            <span key={child}>
              {child === "mod" ? (isMac ? "⌘" : "Ctrl") : child}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <span
      className={cn(
        "ml-auto inline-flex h-[24px] min-w-[24px] items-center justify-center rounded-sm border border-primary/10 bg-primary-foreground/20 px-0.5 text-[12px] text-center capitalize tracking-widest text-primary-foreground",
        className
      )}
      {...props}
    >
      {renderShortcut(children)}
    </span>
  );
};

CommandShortcut.displayName = "CommandShortcut";
