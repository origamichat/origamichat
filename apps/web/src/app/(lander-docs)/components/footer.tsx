import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoText } from "@/components/ui/logo";
import { ThreeLogo } from "@/components/ui/three-logo";
import { DISCORD_INVITE, X_URL } from "@/constants";
import { GitHubLink } from "./github-link";
import { StatusWidget } from "./status-widget";

export function Footer() {
	return (
		<footer className="mt-16 flex-col border-primary/10 border-t border-dashed md:mt-0 md:border-transparent">
			<div className="container-wrapper z-0 mx-auto px-2 py-12 lg:px-0">
				<div className="container grid grid-cols-1 gap-8 px-6 md:grid-cols-4 lg:px-4">
					{/* Brand */}
					<div className="col-span-1 md:col-span-2">
						<div className="mb-4 flex items-center space-x-2">
							<LogoText />
						</div>
						<p className="mb-6 max-w-md font-mono text-foreground/60 text-sm">
							the open-source, ai-native support infrastructure for modern saas.
							built for developers, designed for your customers.
						</p>
						<div className="mt-10 flex items-center gap-2">
							<StatusWidget
								href="https://cossistant.openstatus.dev"
								slug="cossistant"
							/>
							<GitHubLink>Star us on GitHub</GitHubLink>
						</div>
					</div>

					{/* Product */}
					<div>
						<h3 className="mb-4 font-mono font-semibold text-foreground text-sm">
							Links
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
									href="/docs"
								>
									Docs
								</Link>
							</li>
						</ul>
					</div>

					{/* Community */}
					<div>
						<h3 className="mb-4 font-mono font-semibold text-foreground text-sm">
							Community
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
									href={DISCORD_INVITE}
									rel="noopener noreferrer"
									target="_blank"
								>
									Discord
								</a>
							</li>
							<li>
								<a
									className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
									href={X_URL}
									rel="noopener noreferrer"
									target="_blank"
								>
									X
								</a>
							</li>
							{/* <li>
                <a
                  href="#blog"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  blog
                </a>
              </li> */}
						</ul>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center justify-between border-primary/10 border-t border-dashed md:items-start">
				<div className="container-wrapper mx-auto flex flex-col items-center justify-between gap-6 px-4 pt-4 pb-20 md:flex-row md:items-start md:gap-0">
					<div className="flex flex-col gap-4">
						<p className="px-6 text-center font-mono text-foreground/60 text-sm md:text-left lg:px-0">
							© 2025 cossistant. open source under GPL-3.0 license.
						</p>
						<div className="mt-4 flex items-center space-x-6 px-6 md:mt-0 lg:px-0">
							<a
								className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
								href="#privacy"
							>
								Privacy
							</a>
							<a
								className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
								href="#terms"
							>
								Terms
							</a>
							<a
								className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
								href="https://github.com/cossistantcom/cossistant?tab=security-ov-file#readme"
							>
								Security
							</a>
						</div>
					</div>
					<ThemeToggle />
				</div>
				<div className="container-wrapper mx-auto flex flex-col items-center justify-between gap-6 px-4 pt-4 pb-4 md:flex-row md:items-start md:gap-0">
					<ThreeLogo className="size-full w-full" />
				</div>
			</div>
		</footer>
	);
}
