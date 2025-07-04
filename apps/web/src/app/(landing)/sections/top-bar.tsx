"use client";

import Link from "next/link";

import { DiscordIcon, GithubIcon } from "@/components/auth/login-form";
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
		<div className={cn("fixed top-6 right-0 left-0 z-50", className)}>
			<div className="mx-auto max-w-3xl rounded-full bg-background-200 p-2">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="ml-4 flex items-center space-x-2">
						{/* <Logo className="size-6" /> */}
						<span className="font-medium font-mono text-base text-foreground">
							cossistant
						</span>
					</div>

					{/* Navigation */}
					<div className="hidden items-center space-x-4 md:flex">
						<Link
							className="font-mono text-foreground text-sm transition-colors hover:text-foreground"
							href="/docs"
						>
							<span className="text-foreground/30">[</span>docs
							<span className="text-foreground/30">]</span>
						</Link>
						<Link
							className="flex items-center gap-1 font-mono text-foreground/70 text-sm transition-colors hover:text-foreground"
							href={GITHUB_URL}
						>
							<span className="text-foreground/30">[</span>
							<GithubIcon className="mr-1" /> github
							<span className="text-foreground/30">]</span>
						</Link>
						<Link
							className="flex items-center gap-1 font-mono text-foreground/70 text-sm transition-colors hover:text-foreground"
							href={DISCORD_INVITE}
						>
							<span className="text-foreground/30">[</span>
							<DiscordIcon className="mr-1" /> discord
							<span className="text-foreground/30">]</span>
						</Link>
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
		</div>
	);
}
