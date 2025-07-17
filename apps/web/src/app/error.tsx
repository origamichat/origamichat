"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";
import { TextEffect } from "@/components/ui/text-effect";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Context7: Log error for monitoring
		console.error("Context7 Error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
			<div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
				<TextEffect
					as="h1"
					className="font-f37-stout text-3xl leading-tight lg:text-5xl"
					per="word"
					preset="blur"
				>
					Something went wrong
				</TextEffect>

				<p className="text-base text-primary/70 md:text-lg">
					An unexpected error occurred. We apologize for the inconvenience.
					Please try again or contact us on twitter @_anthonyriera
				</p>

				{error.digest && (
					<p className="font-mono text-primary/50 text-sm">
						Error ID: {error.digest}
					</p>
				)}

				<div className="mt-6 flex flex-col gap-3 md:flex-row md:gap-4">
					<Button
						className="h-12 w-full justify-between border border-transparent font-medium has-[>svg]:px-4 md:w-[200px]"
						onClick={reset}
						size="lg"
					>
						Try again
					</Button>
					<Link href="/">
						<Button
							className="h-12 w-full font-medium md:w-[200px]"
							size="lg"
							variant="outline"
						>
							Go home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
