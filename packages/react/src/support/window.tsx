import * as React from "react";
import { useSupport } from "../provider";
import { useRenderElement } from "../utils/use-render-element";

export interface WindowRenderProps {
  isOpen: boolean;
  close: () => void;
}

export interface WindowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode | ((props: WindowRenderProps) => React.ReactNode);
  asChild?: boolean;
  closeOnEscape?: boolean;
  id?: string;
}

export const SupportWindow = React.forwardRef<HTMLDivElement, WindowProps>(
  (
    {
      isOpen: isOpenProp,
      onOpenChange,
      children,
      className,
      asChild = false,
      closeOnEscape = true,
      id = "cossistant-window",
      ...props
    },
    ref
  ) => {
    const context = useSupport();
    const isOpen = isOpenProp ?? context?.isOpen ?? false;

    const close = React.useCallback(() => {
      if (onOpenChange) {
        onOpenChange(false);
      } else if (context?.close) {
        context.close();
      }
    }, [onOpenChange, context?.close]);

    // Close on Escape
    React.useEffect(() => {
      if (!(isOpen && closeOnEscape)) {
        return;
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          close();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, close, closeOnEscape]);

    const renderProps: WindowRenderProps = { isOpen, close };

    const content =
      typeof children === "function" ? children(renderProps) : children;

    return useRenderElement(
      "div",
      {
        className,
        asChild,
      },
      {
        ref,
        state: renderProps,
        props: {
          role: "dialog",
          "aria-modal": "true",
          id,
          ...props,
          children: content,
        },
        enabled: isOpen,
      }
    );
  }
);

SupportWindow.displayName = "SupportWindow";
