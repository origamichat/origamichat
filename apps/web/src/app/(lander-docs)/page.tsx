import { ComponentPreview } from "@/components/component-preview";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";
import { Logos } from "@/components/ui/logos";
import { GitHubLink } from "./components/github-link";

// Force dynamic rendering since this page depends on user authentication
export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="flex min-h-screen flex-col gap-8 pt-32 md:flex-row md:items-center md:pt-0">
				<div className="flex gap-20">
					<div className="flex flex-1 flex-col items-start justify-between gap-6 pt-11">
						<p className="font-mono text-foreground/60 text-xs">
							Escape the iframe
						</p>
						<div className="my-auto flex flex-col gap-6">
							<h1 className="font-f37-stout text-4xl leading-tight lg:text-6xl">
								Extraordinary AI and human
								<br />
								<span className="text-cossistant-blue">{"<Support /> "}</span>
								right in your app.
							</h1>
							<h3 className="max-w-[80%] text-balance text-lg text-primary/70">
								Cossistant is the open-source support framework that puts human
								and AI help right in your React app with custom actions and UI.
							</h3>
							<div className="mt-10 flex flex-col items-center gap-6 lg:flex-row">
								<Button
									className="h-16 w-[280px] justify-between border border-transparent font-medium text-md has-[>svg]:px-4"
									size="lg"
								>
									Join the waitlist
									<Icon
										className="size-4 transition-transform group-hover/btn:translate-x-1"
										name="arrow-right"
									/>
								</Button>
								<GitHubLink
									className="h-16 w-[280px] justify-between px-4 font-medium text-md"
									size="lg"
									variant="outline"
								>
									Star us on GitHub
								</GitHubLink>
							</div>
							<p className="font-mono text-foreground/60 text-xs">
								Already 28 people on the waitlist. Join them, be early.
							</p>
						</div>
						<div className="mt-auto flex items-center gap-2">
							<p className="font-mono text-foreground/60 text-xs">
								Works well with
							</p>
							<Logos.react className="size-4" />
							<Logos.tailwind className="size-4" />
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
