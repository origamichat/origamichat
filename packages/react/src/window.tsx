import * as React from "react";
import { useCossistant } from "./provider";

export interface WindowProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  id?: string;
}

export const Window = React.forwardRef<HTMLDivElement, WindowProps>(
  (
    { header, footer, children, className, id = "cossistant-window", ...props },
    ref
  ) => {
    const { isOpen, close } = useCossistant();

    React.useEffect(() => {
      if (!isOpen) {
        return;
      }
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
          close();
        }
      }
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, close]);

    if (!isOpen) {
      return null;
    }

    return (
      <div
        aria-modal="true"
        className={className}
        id={id}
        ref={ref}
        role="dialog"
        {...props}
      >
        {header && <div>{header}</div>}
        <div>{children}</div>
        {footer && <div>{footer}</div>}
      </div>
    );
  }
);

Window.displayName = "Window";
