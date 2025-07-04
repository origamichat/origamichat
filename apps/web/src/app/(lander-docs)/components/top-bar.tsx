"use client";

import Link from "next/link";
import {
  DiscordIcon,
  GithubIcon,
} from "@/app/(lander-docs)/components/login-form";
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
    <div className={cn("fixed top-6 right-0 left-0 z-50", className)}>
      <div className="mx-auto max-w-3xl rounded-full bg-background-200 p-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link className="ml-4 flex items-center space-x-2" href="/">
            {/* <Logo className="size-6" /> */}
            <span className="font-medium font-mono text-base text-foreground">
              cossistant
            </span>
          </Link>

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
