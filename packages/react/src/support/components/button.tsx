import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Button as ButtonPrimitive } from "../../primitive/button";
import { cn } from "../utils";

const buttonVariants = cva(
  "group/btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all hover:cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-co-primary text-co-primary-foreground hover:bg-co-primary/90",
        ghost:
          "hover:bg-co-background-200 hover:text-co-foreground dark:hover:bg-co-background-300",
        outline:
          "border border-co-border bg-co-background hover:bg-co-background-100 dark:hover:bg-co-background-200",
        tab: "opacity-40 hover:bg-co-background-100 hover:text-co-foreground hover:opacity-90 dark:hover:bg-co-background-200",
        "tab-selected":
          "hover:bg-co-background-100 hover:text-co-foreground dark:hover:bg-co-background-200",
      },
      size: {
        default: "h-8 px-4 py-2 has-[>svg]:px-3",
        large: "h-12 px-6 py-3 has-[>svg]:px-4",
        icon: "size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
