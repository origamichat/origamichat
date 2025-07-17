"use client";

import { motion } from "motion/react";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ComponentPreviewTabs({
	className,
	align = "center",
	component,
	source,
	withOrnament = false,
	sizeClasses = "h-[350px] w-full md:h-[450px] md:w-[600px]",
}: React.ComponentProps<"div"> & {
	align?: "center" | "start" | "end";
	component: React.ReactNode;
	source: React.ReactNode;
	withOrnament?: boolean;
	sizeClasses?: string;
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
			<div className="relative rounded bg-background p-[3px]">
				{withOrnament && (
					<>
						{/* left */}
						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-10 -bottom-10 pointer-events-none absolute left-0 w-[1px] bg-primary/20"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-6 -bottom-6 pointer-events-none absolute left-4 z-[-1] w-[1px] bg-primary/20"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
						/>

						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-[25vh] pointer-events-none absolute left-0 h-[100vh] w-[1px] border-primary/10 border-l border-dashed"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-[25vh] pointer-events-none absolute left-4 h-[100vh] w-[1px] border-primary/10 border-l border-dashed"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
						/>

						{/* right */}
						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-10 -bottom-10 pointer-events-none absolute right-[-1px] w-[1px] bg-primary/20"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-6 -bottom-6 pointer-events-none absolute right-4 z-[-1] w-[1px] bg-primary/20"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
						/>

						{/* <motion.div
              animate={{ scaleY: 1 }}
              className="-top-[25vh] pointer-events-none absolute right-0 h-[100vh] w-[1px] border-red-600 border-r border-dashed"
              initial={{ scaleY: 0 }}
              style={{ originY: 0.5 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            /> */}
						<motion.div
							animate={{ scaleY: 1 }}
							className="-top-[25vh] pointer-events-none absolute right-4 h-[100vh] w-[1px] border-primary/10 border-r border-dashed"
							initial={{ scaleY: 0 }}
							style={{ originY: 0.5 }}
							transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
						/>

						{/* top */}
						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-6 -right-6 pointer-events-none absolute top-0 h-[1px] bg-primary/20"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-6 -right-6 pointer-events-none absolute top-4 z-[-1] h-[1px] bg-primary/20"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
						/>

						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-[100vw] -right-6 pointer-events-none absolute top-0 h-[1px] w-[300vw] border-primary/10 border-t border-dashed"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-[100vw] -right-6 pointer-events-none absolute top-4 h-[1px] w-[300vw] border-primary/10 border-t border-dashed"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
						/>

						{/* bottom */}
						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-6 -right-6 pointer-events-none absolute bottom-0 h-[1px] bg-primary/20"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-6 -right-6 pointer-events-none absolute bottom-4 z-[-1] h-[1px] bg-primary/20"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
						/>

						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-[100vw] -right-6 pointer-events-none absolute bottom-0 h-[1px] w-[300vw] border-primary/10 border-b border-dashed"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
						/>
						<motion.div
							animate={{ scaleX: 1 }}
							className="-left-[100vw] -right-6 pointer-events-none absolute bottom-4 h-[1px] w-[300vw] border-primary/10 border-b border-dashed"
							initial={{ scaleX: 0 }}
							style={{ originX: 0.5 }}
							transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
						/>
					</>
				)}
				{tab === "preview" && (
					<div
						className={cn(
							"flex w-full justify-center p-10",
							sizeClasses,
							align === "start" && "items-start",
							align === "center" && "items-center",
							align === "end" && "items-end"
						)}
					>
						{component}
					</div>
				)}
				{tab === "code" && (
					<div
						className={cn(
							"scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-background-100 overflow-auto bg-background-100 px-5 py-4",
							sizeClasses
						)}
					>
						{source}
					</div>
				)}
			</div>
		</div>
	);
}
