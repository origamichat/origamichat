import { cn } from "../utils";
import { Button } from "./button";
import Icon from "./icons";

export interface HeaderProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onGoBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  title = "Support",
  children,
  actions,
  onGoBack,
}) => {
  return (
    <div className={cn("relative z-10 h-14 overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-co-background to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-0 h-24 bg-gradient-to-b from-co-background via-co-background to-transparent" />
      <div className="absolute inset-0 z-10 flex h-16 items-center justify-between px-4">
        <div className="flex flex-1 items-center">
          {onGoBack && (
            <Button
              onClick={onGoBack}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Icon name="arrow-left" />
            </Button>
          )}
          {children}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};
