"use client";

import { Logo } from "@/components/ui/logo";
import { DISCORD_INVITE, GITHUB_URL } from "@/constants";

export function TopBar() {
	return (
		<div className="fixed top-0 right-0 left-0 z-50">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center space-x-2">
						<Logo className="size-6" />
						<span className="font-medium font-mono text-base text-foreground">
							cossistant
						</span>
					</div>

					{/* Navigation */}
					<div className="hidden items-center space-x-8 md:flex">
						{/* <a
              href="#docs"
              className="text-sm font-mono text-foreground/70 hover:text-foreground transition-colors"
            >
              docs
            </a> */}
						<a
							className="font-mono text-foreground/70 text-sm transition-colors hover:text-foreground"
							href={GITHUB_URL}
						>
							github
						</a>
						<a
							className="font-mono text-foreground/70 text-sm transition-colors hover:text-foreground"
							href={DISCORD_INVITE}
						>
							discord
						</a>
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
