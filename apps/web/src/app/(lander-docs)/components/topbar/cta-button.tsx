"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHasScrolled } from "@/hooks/use-has-scrolled";

export function CtaButton() {
	const hasScrolled = useHasScrolled(200);

	return (
		<Link href="/">
			<Button
				className="border border-transparent"
				variant={hasScrolled ? "default" : "outline"}
			>
				Join waitlist
			</Button>
		</Link>
	);
}
