import { Suspense } from "react";

import { WaitingList } from "@/app/(lander-docs)/components/waiting-list";
import RegisterReferral from "@/app/(lander-docs)/components/waiting-list/register-referral";
import { WaitingListSkeleton } from "@/app/(lander-docs)/components/waiting-list/waiting-list-skeleton";
import { TextEffect } from "@/components/ui/text-effect";
import { generateSiteMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = generateSiteMetadata({
	title: "You're on the waitlist",
});

function Page() {
	return (
		<main className="flex min-h-screen flex-col gap-6 px-6 pt-20 md:pt-48">
			<RegisterReferral />
			<div className="mx-auto flex w-full max-w-lg flex-col gap-6">
				<TextEffect
					as="h1"
					className="text-balance font-f37-stout font-medium text-4xl md:text-6xl md:leading-tight"
					per="word"
					preset="blur"
				>
					You&apos;re on the waitlist
				</TextEffect>
				<p className="mb-6 text-base text-primary/70 md:text-lg">
					We&apos;ll notify you by email as soon as the waitlist opens. You want
					to go to the top of the waitlist? here&apos;s how to do it:
				</p>
			</div>
			<Suspense fallback={<WaitingListSkeleton />}>
				<WaitingList />
			</Suspense>
		</main>
	);
}

export default Page;
