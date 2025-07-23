"use client";

import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import * as Primitive from "../../primitive";
import { cn } from "../utils";
import Icon from "./icons";

export interface BubbleProps {
	className?: string;
}

export const Bubble: React.FC<BubbleProps> = ({ className }) => {
	return (
		<Primitive.Bubble
			className={cn(
				"relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-co-background-300 text-co-primary transition-colors hover:bg-co-background-400 data-[open=true]:bg-co-background-500",
				className
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
								<Icon className="h-5 w-5" name="chevron-down" />
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
								<Icon className="h-6 w-6" name="chat" variant="filled" />
							</motion.div>
						)}
					</AnimatePresence>
					{unreadCount > 0 && (
						<motion.span
							animate={{ scale: 1, opacity: 1 }}
							className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-co-destructive font-medium text-co-destructive-foreground text-xs"
							exit={{ scale: 0, opacity: 0 }}
							initial={{ scale: 0, opacity: 0 }}
						>
							{unreadCount}
						</motion.span>
					)}
				</>
			)}
		</Primitive.Bubble>
	);
};
