import { TopBar } from "@/app/(landing)/sections/top-bar";
import { TextEffect } from "@/components/ui/text-effect";

export const dynamic = "force-dynamic";

async function Page() {
	return (
		<main className="flex h-screen flex-col items-center justify-center gap-6 px-6 pt-20 md:pt-6">
			<TopBar />
			<div className="flex w-full max-w-lg flex-col gap-6">
				<TextEffect
					as="h1"
					className="font-medium text-4xl md:text-6xl md:leading-tight"
					per="word"
					preset="blur"
				>
					We&apos;re sorry, but there was an error.
				</TextEffect>
				<p className="mb-6 text-base text-primary/70 md:text-lg">
					Please try again later or contact us on twitter @_anthonyriera
				</p>
			</div>
		</main>
	);
}

export default Page;
