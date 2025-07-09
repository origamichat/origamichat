"use client";

// headless support lib from @cossistant/react
import { Support, SupportProvider } from "@cossistant/react";

import { AnimatePresence, motion } from "motion/react";

import * as React from "react";
import { cn } from "@/lib/utils";
import Icon from "../ui/icons";
import { TooltipOnHover } from "../ui/tooltip";

// This is a demo widget that uses the headless support lib from @cossistant/react

export function DemoSupportWidget() {
	const [value, setValue] = React.useState("");

	const handleSubmit = () => {
		// TODO: integrate with backend
		setValue("");
	};

	return (
		<SupportProvider>
			<div className="relative">
				<Support.Bubble
					className={cn(
						"group/btn flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground",
						"group-data-[open=true]/btn:bg-primary/50"
					)}
				>
					{({ isOpen, unreadCount, toggle }) => (
						<>
							<AnimatePresence mode="wait">
								{isOpen ? (
									<motion.div
										animate={{
											scale: 1,
											rotate: 0,
											opacity: 1,
											transition: { duration: 0.2, ease: "easeOut" },
										}}
										className="flex items-center justify-center"
										exit={{
											scale: 0.9,
											rotate: -45,
											opacity: 0,
											transition: { duration: 0.1, ease: "easeIn" },
										}}
										initial={{ scale: 0.9, rotate: 45, opacity: 0 }}
										key="chevron"
									>
										<Icon className="size-5" name="chevron-down" />
									</motion.div>
								) : (
									<motion.div
										animate={{
											scale: 1,
											rotate: 0,
											opacity: 1,
											transition: { duration: 0.2, ease: "easeOut" },
										}}
										className="flex items-center justify-center"
										exit={{
											scale: 0.9,
											rotate: 45,
											opacity: 0,
											transition: { duration: 0.1, ease: "easeIn" },
										}}
										initial={{ scale: 0.9, rotate: -45, opacity: 0 }}
										key="chat"
									>
										<Icon className="size-6" name="chat" variant="filled" />
									</motion.div>
								)}
							</AnimatePresence>
							{unreadCount > 0 && (
								<motion.span
									animate={{ scale: 1, opacity: 1 }}
									className="-right-1 -top-1 absolute flex size-4 items-center justify-center rounded-full bg-red-500 text-white text-xs"
									exit={{ scale: 0, opacity: 0 }}
									initial={{ scale: 0, opacity: 0 }}
								>
									{unreadCount}
								</motion.span>
							)}
						</>
					)}
				</Support.Bubble>
				<Support.Window
					className={cn(
						"absolute right-16 bottom-0 z-50 flex h-[400px] w-80 flex-col",
						"rounded border bg-background shadow-lg"
					)}
				>
					<div className="flex h-10 items-center px-3">
						<p className="font-medium text-sm">Support</p>
					</div>
					<div className="flex-1 overflow-y-auto p-3">
						{/* messages go here */}
					</div>
					<div className="flex flex-col">
						<div className="flex items-end gap-2 border-t p-3">
							<Support.Input
								className="flex-1 resize-none overflow-hidden rounded border px-2 py-1"
								onChange={setValue}
								onSubmit={handleSubmit}
								value={value}
							/>
							<TooltipOnHover content="Send" shortcuts={["Enter"]}>
								<Support.SendButton
									className="group/btn flex size-8 items-center justify-center rounded text-primary"
									onClick={handleSubmit}
								>
									<Icon className="size-4" filledOnHover name="send" />
								</Support.SendButton>
							</TooltipOnHover>
						</div>
						<p className="h-8 text-center text-muted-foreground text-xs">
							Powered by{" "}
							<a
								className="font-medium text-primary"
								href="https://cossistant.com"
								rel="noopener noreferrer"
								target="_blank"
							>
								Cossistant
							</a>
						</p>
					</div>
				</Support.Window>
			</div>
		</SupportProvider>
	);
}

export default DemoSupportWidget;
