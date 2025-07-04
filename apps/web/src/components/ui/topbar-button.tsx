"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { cn } from "@/lib/utils";
import { TooltipOnHover } from "./tooltip";

interface TopbarButtonProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	icon?: React.ReactNode;
	tooltip?: string;
	shortcuts?: string[];
}

export function TopbarButton({
	href,
	children,
	className,
	icon,
	tooltip,
	shortcuts,
}: TopbarButtonProps) {
	const router = useRouter();

	useHotkeys(
		[shortcuts?.join("+") ?? ""],
		() => {
			router.push(href);
		},
		{
			enabled: !!shortcuts,
			preventDefault: true,
		}
	);
	return (
		<TooltipOnHover content={tooltip} shortcuts={shortcuts}>
			<Link
				className={cn(
					"group flex items-center gap-1 font-mono text-foreground/70 text-sm transition-colors hover:text-foreground",
					className
				)}
				href={href}
			>
				<span className="text-foreground/30 transition-all duration-200 group-hover:translate-x-[-1px] group-hover:rotate-[-1deg] group-hover:scale-105">
					[
				</span>
				{icon && <span className="mr-1">{icon}</span>}
				{children}
				<span className="text-foreground/30 transition-all duration-200 group-hover:translate-x-[1px] group-hover:rotate-[1deg] group-hover:scale-105">
					]
				</span>
			</Link>
		</TooltipOnHover>
	);
}
