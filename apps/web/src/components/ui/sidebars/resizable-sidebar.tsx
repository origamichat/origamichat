"use client";

import type { ReactNode } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
	DEFAULT_SIDEBAR_WIDTH,
	type SidebarPosition,
	useSidebar,
} from "@/hooks/use-sidebars";
import { cn } from "@/lib/utils";
import { TooltipOnHover } from "../tooltip";

type ResizableSidebarProps = {
	className?: string;
	children: ReactNode;
	position: SidebarPosition;
};

export const ResizableSidebar = ({
	className,
	children,
	position,
}: ResizableSidebarProps) => {
	const { open, toggle } = useSidebar({ position });

	return (
		<>
			<aside
				className={cn(
					"relative flex h-screen max-h-screen border-transparent p-0 transition-all duration-200 ease-in-out",
					className,
					{
						"ml-[3px] p-0": !open,
					}
				)}
				style={{
					width: open ? DEFAULT_SIDEBAR_WIDTH : 0,
				}}
			>
				{open && (
					<>
						{children}
						<SidebarHandle isCollapsed={!open} onToggle={toggle} />
					</>
				)}
			</aside>
			{!open && <SidebarHandle isCollapsed={!open} onToggle={toggle} />}
		</>
	);
};

type SidebarHandleProps = {
	isCollapsed?: boolean;
	onToggle: () => void;
	hotkeys?: string[];
	position?: "left" | "right";
	onClose?: () => void;
};

const SidebarHandle = ({
	isCollapsed,
	onToggle,
	hotkeys = ["shift", "s"],
	position = "right",
	onClose,
}: SidebarHandleProps) => {
	// Open the open on key stroke
	useHotkeys(
		[hotkeys.join("+")],
		() => {
			onToggle();
		},
		{
			preventDefault: true,
		}
	);

	const handleClick = () => {
		onToggle();
		onClose?.();
	};

	const tooltipContent = isCollapsed ? (
		"Click to open"
	) : (
		<div className="flex flex-col gap-1">
			<span>Click to close</span>
		</div>
	);

	return (
		<button
			className={cn(
				"relative z-10 hidden max-h-screen w-auto items-center justify-center bg-transparent md:flex",
				position === "right" ? "-right-[6px]" : "-left-[6px]",
				{
					"-right-[14px] absolute top-0 bottom-0":
						!isCollapsed && position === "right",
					"-left-[10px] absolute top-0 bottom-0":
						!isCollapsed && position === "left",
				}
			)}
			onClick={handleClick}
			type="button"
		>
			<TooltipOnHover content={tooltipContent} shortcuts={hotkeys} side="right">
				<div
					className={cn(
						"group flex h-full items-center justify-center border-transparent transition-all hover:cursor-pointer hover:border-background-100",
						position === "left" ? "border-r-4" : "border-l-4"
					)}
				>
					<div className="h-fit w-4 flex-col items-center justify-center bg-transparent hover:cursor-pointer">
						{position === "right" ? (
							<>
								<div
									className={cn(
										"-mb-[3px] h-4 w-[3px] rounded bg-background-500 transition-all group-hover:h-6 group-hover:rotate-6 group-hover:bg-background-600",
										{
											"group-hover:-rotate-6": isCollapsed,
										}
									)}
								/>
								<div
									className={cn(
										"-mt-[3px] group-hover:-rotate-6 h-4 w-[3px] rounded bg-background-500 transition-all group-hover:h-6 group-hover:bg-background-600",
										{
											"group-hover:rotate-6": isCollapsed,
										}
									)}
								/>
							</>
						) : (
							<>
								<div
									className={cn(
										"-mb-[3px] group-hover:-rotate-6 h-4 w-[3px] rounded bg-background-500 transition-all group-hover:h-6 group-hover:bg-background-600",
										{
											"group-hover:-rotate-6": isCollapsed,
										}
									)}
								/>
								<div
									className={cn(
										"-mt-[3px] h-4 w-[3px] rounded bg-background-500 transition-all group-hover:h-6 group-hover:rotate-6 group-hover:bg-background-600",
										{
											"group-hover:rotate-6": isCollapsed,
										}
									)}
								/>
							</>
						)}
					</div>
				</div>
			</TooltipOnHover>
		</button>
	);
};
