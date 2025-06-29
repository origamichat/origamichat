"use client";
import { Support, SupportProvider } from "@cossistant/react";

import * as React from "react";
import { cn } from "@/lib/utils";
import Icon from "../ui/icons";

export function DemoSupportWidget() {
	const [value, setValue] = React.useState("");

	const handleSubmit = () => {
		// TODO: integrate with backend
		setValue("");
	};

	return (
		<SupportProvider>
			<Support.Bubble
				className={cn(
					"group/btn flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground",
					"group-data-[open=true]/btn:bg-primary/50"
				)}
			>
				{({ isOpen, unreadCount, toggle }) => (
					<>
						<Icon className="size-6" name="chat" variant="filled" />
						{unreadCount > 0 && (
							<span className="-right-1 -top-1 absolute size-4 rounded-full bg-red-500 text-white text-xs">
								{unreadCount}
							</span>
						)}
					</>
				)}
			</Support.Bubble>
			<Support.Window
				className={cn(
					"fixed right-4 bottom-20 z-50 flex w-80 flex-col",
					"rounded border bg-background shadow-lg"
				)}
			>
				<div className="flex-1 overflow-y-auto p-3">
					{/* messages go here */}
				</div>
				<div className="flex items-end gap-2 border-t p-3">
					<Support.Input
						className="flex-1 resize-none rounded border px-2 py-1"
						onChange={setValue}
						onSubmit={handleSubmit}
						value={value}
					/>
					<Support.SendButton
						className="rounded bg-primary px-3 py-1 text-primary-foreground"
						onClick={handleSubmit}
					>
						Send
					</Support.SendButton>
				</div>
			</Support.Window>
		</SupportProvider>
	);
}
