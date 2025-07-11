import Link from "next/link";
import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import Icon from "@/components/ui/icons";
import { Logos } from "@/components/ui/logos";
import { Skeleton } from "@/components/ui/skeleton";
import { GITHUB_URL } from "@/constants";
import { cn } from "@/lib/utils";

export function GitHubLink({
	className,
	onHover,
	size = "sm",
	variant = "ghost",
	children,
}: {
	className?: string;
	onHover?: () => void;
	size?: ButtonProps["size"];
	variant?: ButtonProps["variant"];
	children?: React.ReactNode;
}) {
	return (
		<Link href={GITHUB_URL} rel="noreferrer" target="_blank">
			<Button
				className={cn("flex h-8 items-center gap-2 shadow-none", className)}
				onMouseEnter={onHover}
				size={size}
				variant={variant}
			>
				<div className="flex items-center gap-2">
					<Logos.gitHub />
					{children && <span>{children}</span>}
				</div>
				<React.Suspense fallback={<Skeleton className="h-4 w-8" />}>
					<StarsCount />
				</React.Suspense>
			</Button>
		</Link>
	);
}

export async function StarsCount() {
	const data = await fetch(
		"https://api.github.com/repos/cossistantcom/cossistant",
		{
			next: { revalidate: 86_400 }, // Cache for 1 day (86400 seconds)
		}
	);
	const json = await data.json();

	return (
		<span className="flex w-8 items-center gap-2 text-muted-foreground text-xs tabular-nums">
			<Icon
				className="size-3 text-muted-foreground"
				filledOnHover
				name="star"
			/>
			{json.stargazers_count >= 1000
				? `${(json.stargazers_count / 1000).toFixed(1)}k`
				: json.stargazers_count.toLocaleString()}
		</span>
	);
}
