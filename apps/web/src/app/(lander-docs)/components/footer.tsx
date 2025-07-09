import { StatusWidget } from "@openstatus/react";
import Link from "next/link";
import { LogoText } from "@/components/ui/logo";
import { DISCORD_INVITE, GITHUB_URL, X_URL } from "@/constants";

export function Footer() {
  return (
    <footer className="flex-col pb-50">
      <div className="container z-0 mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <LogoText />
            </div>
            <p className="mb-6 max-w-md font-mono text-foreground/60 text-sm">
              the open-source, ai-native support infrastructure for modern saas.
              built for developers, designed for your customers.
            </p>
            <StatusWidget
              href="https://cossistant.openstatus.dev"
              slug="cossistant"
            />
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
                  href={GITHUB_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
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
      <div className="mt-8 border-primary/10 border-t border-dashed pt-8">
        <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
          <p className="font-mono text-foreground/60 text-sm">
            © 2025 cossistant. open source under GPL-3.0 license.
          </p>
          <div className="mt-4 flex items-center space-x-6 md:mt-0">
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
              href="#security"
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
