"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TooltipOnHover } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Icon from "./ui/icons";

export function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof Button> & {
  value: string;
  src?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      toast.success("Copied to clipboard", {
        duration: 3000,
      });

      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    }
  }, [hasCopied]);

  return (
    <TooltipOnHover content={hasCopied ? "Copied" : "Copy to Clipboard"}>
      <Button
        className={cn(
          "absolute top-3 right-1 z-10 size-7 hover:opacity-100 focus-visible:opacity-100",
          className
        )}
        data-slot="copy-button"
        onClick={() => {
          copyToClipboardWithMeta(value);
          setHasCopied(true);
        }}
        size="icon"
        variant={variant}
        {...props}
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? (
          <Icon name="check" />
        ) : (
          <Icon filledOnHover name="clipboard" />
        )}
      </Button>
    </TooltipOnHover>
  );
}
