import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all [&_svg:not([class*= hover:cursor-pointer focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: cn(
          // Bg
          'bg-gradient-to-b from-[#323232] to-[#222222] text-primary-foreground hover:from-[#3E3E3E] hover:to-[#222222] active:from-[#222222] active:to-[#323232]',
          // Btn textures on light mode
          "shadow-[inset_0_-1px_1.2px_0.35px_#121212,inset_0_1px_1px_0_rgba(255,255,255,0.20),0_2px_10px_-1px_rgba(13,13,13,0.8),0_0_0_1.5px_#333333]",
          "hover:shadow-[inset_0_-1px_1.2px_0.35px_#121212,inset_0_1px_2px_0_rgba(255,255,255,0.20),0_2px_10px_-1px_rgba(13,13,13,0.8),0_0_0_1.5px_#333333]",
          "active:shadow-[inset_0_-1px_1.2px_0.35px_#121212,inset_0_1px_1px_0_rgba(255,255,255,0.10),0_2px_10px_-1px_rgba(13,13,13,0.8),0_0_0_1.5px_#333333]"
        ),
        secondary: cn(
          // Bg
          'bg-gradient-to-b from-[#E5E5E5] to-[#E2E2E2] text-primary hover:from-[#F1F1F1] hover:to-[#F2F2F2] active:from-[#E2E2E2] active:to-[#E5E5E5]',
          // Btn textures on light mode
          "shadow-[inset_0_-1px_1.2px_0.35px_#E5E5E5,inset_0_1px_1px_0_rgba(255,255,255,0.7),0_2px_10px_-1px_rgba(13,13,13,0.1),0_0_0_1px_#D4D4D4]",
          "hover:shadow-[inset_0_-1px_1.2px_0.35px_#E5E5E5,inset_0_1px_2px_0_rgba(255,255,255,0.70),0_2px_10px_-1px_rgba(13,13,13,0.1),0_0_0_1px_#D4D4D4]",
          "active:shadow-[inset_0_-1px_1.2px_0.35px_#E5E5E5,inset_0_1px_1px_0_rgba(255,255,255,0.40),0_2px_10px_-1px_rgba(13,13,13,0.1),0_0_0_1px_#D4D4D4]"
        ),
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        ghost: cn(
          "bg-gradient-to-b hover:from-[#F1F1F1] hover:to-[#F2F2F2] active:from-[#E2E2E2] active:to-[#E5E5E5]",
          "hover:shadow-[inset_0_-1px_1.2px_0.35px_#E5E5E5,inset_0_1px_2px_0_rgba(255,255,255,0.70),0_2px_10px_-1px_rgba(13,13,13,0.1),0_0_0_1px_#E6E6E6]",
          "active:shadow-[inset_0_-1px_1.2px_0.35px_#E5E5E5,inset_0_1px_1px_0_rgba(255,255,255,0.40),0_2px_10px_-1px_rgba(13,13,13,0.1),0_0_0_1px_#E6E6E6]"
        ),
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-2 py-2 has-[>svg]:px-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: "h-10 rounded-md px-2 has-[>svg]:px-4",
        icon: "size-9",
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

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			data-slot="button"
			{...props}
		/>
	);
}

export { Button, buttonVariants };
