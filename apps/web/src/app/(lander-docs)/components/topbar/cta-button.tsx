"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHasScrolled } from "@/hooks/use-has-scrolled";
import { cn } from "@/lib/utils";

export function CtaButton() {
	const hasScrolled = useHasScrolled(250);

	return (
		<Link href="/">
			<Button
				className={cn(hasScrolled && "border dark:border-transparent")}
				variant={hasScrolled ? "default" : "outline"}
			>
				Join waitlist
			</Button>
		</Link>
	);
}
