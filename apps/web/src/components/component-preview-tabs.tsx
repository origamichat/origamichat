"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ComponentPreviewTabs({
  className,
  align = "center",
  component,
  source,
  withOrnament = false,
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  component: React.ReactNode;
  source: React.ReactNode;
  withOrnament?: boolean;
}) {
  const [tab, setTab] = React.useState("preview");

  return (
    <div className={cn("group relative flex flex-col gap-2", className)}>
      <Tabs className="relative pl-6" onValueChange={setTab} value={tab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="relative rounded bg-background">
        {withOrnament && (
          <>
            {/* left */}
            <div className="-top-10 -bottom-10 pointer-events-none absolute left-0 w-[1px] bg-primary" />
            <div className="-top-6 -bottom-6 pointer-events-none absolute left-4 z-[-1] w-[1px] bg-primary" />

            <div className="-top-[25vh] pointer-events-none absolute left-0 h-[100vh] w-[1px] border-primary/10 border-l border-dashed" />
            <div className="-top-[25vh] pointer-events-none absolute left-4 h-[100vh] w-[1px] border-primary/10 border-l border-dashed" />

            {/* right */}
            <div className="-top-10 -bottom-10 pointer-events-none absolute right-0 w-[1px] bg-primary" />
            <div className="-top-6 -bottom-6 pointer-events-none absolute right-4 z-[-1] w-[1px] bg-primary" />

            <div className="-top-[25vh] pointer-events-none absolute right-0 h-[100vh] w-[1px] border-primary/10 border-r border-dashed" />
            <div className="-top-[25vh] pointer-events-none absolute right-4 h-[100vh] w-[1px] border-primary/10 border-r border-dashed" />

            {/* top */}
            <div className="-left-6 -right-6 pointer-events-none absolute top-0 h-[1px] bg-primary" />
            <div className="-left-6 -right-6 pointer-events-none absolute top-4 z-[-1] h-[1px] bg-primary" />

            <div className="-left-[100vw] -right-6 pointer-events-none absolute top-0 h-[1px] w-[300vw] border-primary/10 border-t border-dashed" />
            <div className="-left-[100vw] -right-6 pointer-events-none absolute top-4 h-[1px] w-[300vw] border-primary/10 border-t border-dashed" />

            {/* bottom */}
            <div className="-left-6 -right-6 pointer-events-none absolute bottom-0 h-[1px] bg-primary" />
            <div className="-left-6 -right-6 pointer-events-none absolute bottom-4 z-[-1] h-[1px] bg-primary" />

            <div className="-left-[100vw] -right-6 pointer-events-none absolute bottom-0 h-[1px] w-[300vw] border-primary/10 border-b border-dashed" />
            <div className="-left-[100vw] -right-6 pointer-events-none absolute bottom-4 h-[1px] w-[300vw] border-primary/10 border-b border-dashed" />
          </>
        )}
        {tab === "preview" && (
          <div
            className={cn(
              "flex aspect-video h-[450px] w-full justify-center p-10",
              align === "start" && "items-start",
              align === "center" && "items-center",
              align === "end" && "items-end"
            )}
          >
            {component}
          </div>
        )}
        {tab === "code" && (
          <div className="aspect-video h-[450px] overflow-auto px-5 py-4">
            {source}
          </div>
        )}
      </div>
    </div>
  );
}
