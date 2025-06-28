import * as React from "react";
import { useCossistant } from "../provider";

export interface BubbleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  unreadCount?: number;
}

export const BubbleButton = React.forwardRef<HTMLButtonElement, BubbleProps>(
  ({ unreadCount, className, children, ...props }, ref) => {
    const { isOpen, toggle } = useCossistant();

    return (
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={className}
        onClick={toggle}
        ref={ref}
        type="button"
        {...props}
      >
        {children}
        {unreadCount ? <span>{unreadCount}</span> : null}
      </button>
    );
  }
);

BubbleButton.displayName = "BubbleButton";
