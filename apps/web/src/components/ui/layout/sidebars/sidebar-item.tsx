"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Icon, { type IconName } from "../../icons";

interface SidebarItemProps {
	children: ReactNode;
	iconName?: IconName;
	actions?: ReactNode;
	href?: string;
	onClick?: () => void;
	className?: string;
	active?: boolean;
}

export function SidebarItem({
	children,
	iconName,
	actions,
	href,
	onClick,
	className,
	active = false,
}: SidebarItemProps) {
	const baseClasses = cn(
		"group/btn relative flex items-center gap-3 rounded px-1 py-1 text-primary/80 text-sm transition-colors",
		"hover:bg-background-100 hover:text-primary",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
		active && "bg-background-100 text-primary",
		className
	);

	const content = (
		<>
			{iconName && (
				<span
					className={cn(
						"flex size-6 shrink-0 items-center justify-center opacity-60 group-hover/btn:opacity-80",
						{
							"opacity-100 group-hover/btn:opacity-100": active,
						}
					)}
				>
					<Icon
						className="size-5"
						filledOnHover={!active}
						name={iconName}
						variant={active ? "filled" : "default"}
					/>
				</span>
			)}
			<span className="flex-1 truncate">{children}</span>
			{actions && (
				<span className="opacity-0 transition-opacity group-hover/btn:opacity-100">
					{actions}
				</span>
			)}
		</>
	);

	if (href) {
		return (
			<Link className={baseClasses} href={href} onClick={onClick}>
				{content}
			</Link>
		);
	}

	return (
		<button
			className={cn(baseClasses, "w-full text-left")}
			onClick={onClick}
			type="button"
		>
			{content}
		</button>
	);
}
