import Link from "next/link";
import { Suspense } from "react";
import { ComponentPreview } from "@/components/component-preview";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";
import { Logos } from "@/components/ui/logos";
import { TooltipOnHover } from "@/components/ui/tooltip";
import { GitHubLink } from "./components/github-link";
import { WaitingListMessage } from "./components/waiting-list/message";

// Force dynamic rendering since this page depends on user authentication
export const dynamic = "force-dynamic";

export default async function Landing() {
	return (
		<>
			<div className="flex min-h-screen flex-col gap-8 pt-32 md:flex-row md:items-center md:pt-0">
				<div className="flex gap-20">
					<div className="flex flex-1 flex-col items-start justify-between gap-6 pt-11 ">
						<p className="px-6 font-mono text-foreground/60 text-xs lg:px-0">
							Escape the iframe
						</p>
						<div className="my-auto flex flex-col gap-6 px-4">
							<h1 className="font-f37-stout text-3xl leading-tight lg:text-6xl">
								Extraordinary AI and human
								<br />
								<span className="text-cossistant-blue">{"<Support /> "}</span>
								right in your app.
							</h1>
							<h3 className="w-full text-base text-primary/70 md:text-balance md:text-lg">
								Cossistant is the open-source support framework that puts human
								and AI help right in your React app with custom actions and UI.
							</h3>
							<div className="mt-10 flex flex-col gap-3 md:items-center md:gap-6 lg:flex-row">
								<Button
									className="h-16 w-full justify-between border border-transparent font-medium text-md has-[>svg]:px-4 md:w-[280px]"
									size="lg"
								>
									Join the waitlist
									<Icon
										className="size-4 transition-transform group-hover/btn:translate-x-1"
										name="arrow-right"
									/>
								</Button>
								<GitHubLink
									className="h-16 w-full justify-between px-4 font-medium text-md md:w-[280px]"
									size="lg"
									variant="outline"
								>
									Star us on GitHub
								</GitHubLink>
							</div>
							<Suspense
								fallback={
									<p className="text-balance text-center font-mono text-foreground/20 text-xs md:text-left">
										Already xxx people on the waitlist. Join them, be early.
									</p>
								}
							>
								<WaitingListMessage />
							</Suspense>
						</div>
						<div className="mt-10 flex w-full items-center justify-center gap-2 px-6 md:justify-start lg:mt-auto lg:px-0">
							<p className="font-mono text-foreground/60 text-xs">
								Works well with
							</p>
							<TooltipOnHover content="React">
								<Link href="https://react.dev" target="_blank">
									<Logos.react className="size-4" />
								</Link>
							</TooltipOnHover>
							<TooltipOnHover content="Next.js">
								<Link href="https://nextjs.org" target="_blank">
									<Logos.nextjs className="size-4" />
								</Link>
							</TooltipOnHover>
							<TooltipOnHover content="Tailwind">
								<Link href="https://tailwindcss.com" target="_blank">
									<Logos.tailwind className="size-4" />
								</Link>
							</TooltipOnHover>
							<TooltipOnHover content="Shadcn/UI">
								<Link href="https://ui.shadcn.com" target="_blank">
									<Logos.shadcn className="size-4" />
								</Link>
							</TooltipOnHover>
						</div>
					</div>

					<div className="hidden items-center justify-start lg:flex">
						<ComponentPreview
							name="support-widget"
							sizeClasses="h-[70vh] w-[600px] max-h-[800px]"
							withOrnament
						/>
					</div>
				</div>
			</div>
		</>
	);
}
