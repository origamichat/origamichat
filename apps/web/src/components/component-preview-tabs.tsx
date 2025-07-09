"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ComponentPreviewTabs({
	className,
	align = "center",
	component,
	source,
}: React.ComponentProps<"div"> & {
	align?: "center" | "start" | "end";
	component: React.ReactNode;
	source: React.ReactNode;
}) {
	const [tab, setTab] = React.useState("preview");

	return (
		<div className={cn("group relative flex flex-col gap-2", className)}>
			<Tabs className="relative " onValueChange={setTab} value={tab}>
				<TabsList className="grid grid-cols-2">
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className="relative rounded border">
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
					<div className="aspect-video h-[450px] overflow-auto p-10">
						{source}
					</div>
				)}
			</div>
		</div>
	);
}
