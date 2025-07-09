"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <Collapsible
      className={cn("group/collapsible md:-mx-4 relative", className)}
      onOpenChange={setIsOpened}
      open={isOpened}
      {...props}
    >
      <CollapsibleTrigger asChild>
        <div className="absolute top-1.5 right-9 z-10 flex items-center">
          <Button
            className="h-7 rounded px-2 text-muted-foreground"
            size="sm"
            variant="ghost"
          >
            {isOpened ? "Collapse" : "Expand"}
          </Button>
          <Separator className="!h-4 mx-1.5" orientation="vertical" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="[&>figure]:md:!mx-0 relative mt-6 overflow-hidden data-[state=closed]:max-h-64 [&>figure]:mt-0"
        forceMount
      >
        {children}
      </CollapsibleContent>
      <CollapsibleTrigger className="-bottom-2 absolute inset-x-0 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b from-code/70 to-code text-muted-foreground text-sm group-data-[state=open]/collapsible:hidden">
        {isOpened ? "Collapse" : "Expand"}
      </CollapsibleTrigger>
    </Collapsible>
  );
}
