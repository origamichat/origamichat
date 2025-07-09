"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ComponentPreviewTabs({
  className,
  align = "center",
  hideCode = false,
  component,
  source,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  component: React.ReactNode;
  source: React.ReactNode;
}) {
  const [tab, setTab] = React.useState("preview");

  return (
    <div
      className={cn("group relative mt-4 mb-12 flex flex-col gap-2", className)}
      {...props}
    >
      <Tabs
        className="relative mr-auto w-full"
        onValueChange={setTab}
        value={tab}
      >
        <div className="flex items-center justify-between">
          {!hideCode && (
            <TabsList className="justify-start gap-4 rounded-none bg-transparent px-2 md:px-0">
              <TabsTrigger
                className="px-0 text-base text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                value="preview"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger
                className="px-0 text-base text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                value="code"
              >
                Code
              </TabsTrigger>
            </TabsList>
          )}
        </div>
      </Tabs>
      <div
        className="md:-mx-1 relative rounded-lg border data-[tab=code]:border-code"
        data-tab={tab}
      >
        <div
          className="invisible data-[active=true]:visible"
          data-active={tab === "preview"}
          data-slot="preview"
        >
          <div
            className={cn(
              "preview flex h-[450px] w-full justify-center p-10 data-[align=start]:items-start data-[align=end]:items-end data-[align=center]:items-center"
            )}
            data-align={align}
          >
            {component}
          </div>
        </div>
        <div
          className="**:[figure]:!m-0 absolute inset-0 hidden overflow-hidden data-[active=true]:block **:[pre]:h-[450px]"
          data-active={tab === "code"}
          data-slot="code"
        >
          {source}
        </div>
      </div>
    </div>
  );
}
