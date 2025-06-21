import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icons";

export const CommandShortcut = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  const isMac =
    typeof window !== "undefined" &&
    window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const renderShortcut = () => {
    if (children === "mod") {
      return isMac ? <Icon name="command" className="size-3" /> : "Ctrl";
    }
    return children;
  };

  return (
    <span
      className={cn(
        "ml-auto inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-sm border border-primary/10 bg-os-background-100 px-0.5 text-[10px] capitalize tracking-widest text-primary/60",
        className
      )}
      {...props}
    >
      {renderShortcut()}
    </span>
  );
};

CommandShortcut.displayName = "CommandShortcut";
