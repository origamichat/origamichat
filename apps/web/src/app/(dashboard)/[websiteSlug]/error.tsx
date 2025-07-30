"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PageError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="max-w-md text-center">
				<h2 className="mb-4 font-bold text-2xl">Something went wrong!</h2>
				<p className="mb-8 text-muted-foreground">
					There was an error accessing this website. Please try again or contact
					support if the problem persists.
				</p>
				<div className="flex justify-center gap-4">
					<Button onClick={() => reset()}>Try again</Button>
					<Link href="/select">
						<Button variant="outline">Go to Website Selection</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
