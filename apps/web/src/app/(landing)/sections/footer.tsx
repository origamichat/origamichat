"use client";

import { Logo } from "@/components/ui/logo";
import { DISCORD_INVITE, GITHUB_URL, X_URL } from "@/constants";

export function Footer() {
  return (
    <footer className="pb-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-mono font-semibold text-foreground">
                cossistant
              </span>
            </div>
            <p className="text-foreground/60 text-sm max-w-md font-mono">
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
            <h3 className="text-sm font-mono font-semibold text-foreground mb-4">
              community
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  github
                </a>
              </li>
              <li>
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
                >
                  discord
                </a>
              </li>
              <li>
                <a
                  href={X_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-foreground/60 hover:text-foreground transition-colors"
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
        <div className="mt-8 pt-8 border-t border-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm font-mono text-foreground/60">
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
