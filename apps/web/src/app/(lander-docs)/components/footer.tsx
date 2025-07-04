"use client";

import { Logo } from "@/components/ui/logo";
import { DISCORD_INVITE, GITHUB_URL, X_URL } from "@/constants";

export function Footer() {
	return (
		<footer className="pb-50">
			<div className="z-20 mx-auto max-w-7xl px-6 py-12 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="col-span-1 md:col-span-2">
						<div className="mb-4 flex items-center space-x-2">
							<Logo className="h-8 w-8" />
							<span className="font-mono font-semibold text-foreground text-xl">
								cossistant
							</span>
						</div>
						<p className="max-w-md font-mono text-foreground/60 text-sm">
							the open-source, ai-native support infrastructure for modern saas.
							built for developers, designed for your customers.
						</p>
					</div>

					{/* Product */}
					{/* <div>
            <h3 className="text-sm font-mono font-semibold text-foreground mb-4">
              product
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  pricing
                </a>
              </li>
              <li>
                <a
                  href="#docs"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  docs
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  api
                </a>
              </li>
            </ul>
          </div> */}

					{/* Community */}
					<div>
						<h3 className="mb-4 font-mono font-semibold text-foreground text-sm">
							community
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
									href={GITHUB_URL}
									rel="noopener noreferrer"
									target="_blank"
								>
									github
								</a>
							</li>
							<li>
								<a
									className="font-mono text-foreground/60 text-sm transition-colors hover:text-foreground"
									href={DISCORD_INVITE}
									rel="noopener noreferrer"
									target="_blank"
								>
									discord
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

				{/* Bottom */}
				<div className="mt-8 border-foreground/20 border-t pt-8">
					<div className="flex flex-col items-center justify-between md:flex-row">
						<p className="font-mono text-foreground/60 text-sm">
							© 2025 cossistant. open source under mit license.
						</p>
						{/* <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href="#privacy"
                className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
              >
                privacy
              </a>
              <a
                href="#terms"
                className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
              >
                terms
              </a>
              <a
                href="#security"
                className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
              >
                security
              </a>
            </div> */}
					</div>
				</div>
			</div>
		</footer>
	);
}
