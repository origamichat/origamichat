import type * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  variant?: "sm" | "md" | "lg";
}

function Input({
  className,
  type,
  prepend,
  append,
  variant = "md",
  ...props
}: InputProps) {
  return (
    <div className="relative flex w-full items-center">
      {prepend && (
        <div className="pointer-events-none absolute left-3 flex items-center">
          {prepend}
        </div>
      )}
      <input
        className={cn(
          "flex w-full min-w-0 rounded border border-input bg-transparent px-3 py-1 text-md shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          prepend && "pl-10",
          append && "pr-10",
          variant === "sm" && "h-8 text-sm",
          variant === "md" && "h-9 text-md",
          variant === "lg" && "h-10 text-lg",
          className
        )}
        data-slot="input"
        type={type}
        {...props}
      />
      {append && (
        <div className="absolute right-3 flex items-center">{append}</div>
      )}
    </div>
  );
}

export { Input };
