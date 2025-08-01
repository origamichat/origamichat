"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
	children: ReactNode;
	icon?: ReactNode;
	actions?: ReactNode;
	href?: string;
	onClick?: () => void;
	className?: string;
	active?: boolean;
}

export function SidebarItem({
	children,
	icon,
	actions,
	href,
	onClick,
	className,
	active = false,
}: SidebarItemProps) {
	const baseClasses = cn(
		"group relative flex items-center gap-3 rounded-[2px] px-3 py-2 font-medium text-sm transition-colors",
		"hover:bg-os-background-400 hover:text-primary",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
		active && "bg-os-background-400 text-primary",
		className
	);

	const content = (
		<>
			{icon && (
				<span className="flex size-6 shrink-0 items-center justify-center">
					{icon}
				</span>
			)}
			<span className="flex-1 truncate">{children}</span>
			{actions && (
				<span className="opacity-0 transition-opacity group-hover:opacity-100">
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
