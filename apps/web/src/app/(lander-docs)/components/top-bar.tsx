"use client";

import Link from "next/link";
import {
	DiscordIcon,
	GithubIcon,
} from "@/app/(lander-docs)/components/login-form";
import { LogoText } from "@/components/ui/logo";
import { TopbarButton } from "@/components/ui/topbar-button";
import { DISCORD_INVITE, GITHUB_URL } from "@/constants";
import { cn } from "@/lib/utils";

export function TopBar({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"fixed top-0 right-0 left-0 z-50 border-grid-x border-b border-dashed bg-background/50 backdrop-blur-xl",
				className
			)}
		>
			<div className="container-wrapper mx-auto flex items-center justify-between py-3">
				<div className="w-60">
					<Link className="flex items-center" href="/">
						<LogoText />
					</Link>
				</div>

				{/* Navigation */}
				<div className="hidden items-center space-x-4 md:flex">
					<TopbarButton className="text-foreground" href="/docs">
						docs
					</TopbarButton>
					<TopbarButton href={GITHUB_URL} icon={<GithubIcon />}>
						github
					</TopbarButton>
					<TopbarButton href={DISCORD_INVITE} icon={<DiscordIcon />}>
						discord
					</TopbarButton>
				</div>

				<div className="flex w-60 items-center justify-end gap-4">
					{children}
				</div>

				{/* Right side actions */}
				{/* {process.env.NODE_ENV === "development" && (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <SignInButtons />
            </div>
          )} */}
			</div>
		</div>
	);
}
