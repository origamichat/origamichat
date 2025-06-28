import * as React from "react";
import { useCossistant } from "./provider";

export interface BubbleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  unreadCount?: number;
}

export const Bubble = React.forwardRef<HTMLButtonElement, BubbleProps>(
  ({ unreadCount, className, children, ...props }, ref) => {
    const { isOpen, toggle } = useCossistant();

    return (
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={toggle}
        ref={ref}
        className={className}
        {...props}
      >
        {children}
        {unreadCount ? <span>{unreadCount}</span> : null}
      </button>
    );
  },
);

Bubble.displayName = "Bubble";
