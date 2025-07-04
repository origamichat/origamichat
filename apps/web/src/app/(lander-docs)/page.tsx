import { WaitingList } from "@/app/(lander-docs)/components/waiting-list";
import { DemoSupportWidget } from "@/components/support/widget";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Footer } from "./components/footer";
import { TopBar } from "./components/top-bar";

// Force dynamic rendering since this page depends on user authentication
export const dynamic = "force-dynamic";

export default function Landing() {
	if (process.env.NODE_ENV === "production") {
		return (
			<main className="flex h-screen w-screen items-center justify-center">
				<p className="text-center font-medium font-mono text-muted-foreground text-xl">
					Coming soon, by{" "}
					<a
						href="https://twitter.com/_anthonyriera"
						rel="noopener noreferrer"
						target="_blank"
					>
						@_anthonyriera
					</a>
				</p>
			</main>
		);
	}

	return (
		<>
			<div className="container flex min-h-screen items-center bg-background">
				<div className="flex flex-1 items-center justify-start lg:px-8">
					<WaitingList className="border-none bg-transparent md:mx-0 md:mt-0 md:px-0 md:pt-0" />
				</div>

				{/* Right Column - Fixed Visuals */}
				<div className="">
					<DemoSupportWidget />
				</div>
			</div>
			<div className="mt-40 flex w-full flex-col items-center justify-center gap-6" />
			<ProgressiveBlur
				blurIntensity={1}
				className="pointer-events-none fixed top-0 right-0 left-0 z-5 h-[200px] w-full"
				direction="top"
			/>
			<ProgressiveBlur
				blurIntensity={1}
				className="pointer-events-none fixed right-0 bottom-0 left-0 z-5 h-[200px] w-full"
				direction="bottom"
			/>
			<Footer />
		</>
	);
}
