import { ComponentPreview } from "@/components/component-preview";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";

// Force dynamic rendering since this page depends on user authentication
export const dynamic = "force-dynamic";

export default function Landing() {
	return (
		<>
			<div className="flex min-h-screen flex-col gap-8 pt-32 md:flex-row md:items-center md:pt-0">
				<div className="flex gap-20">
					<div className="flex flex-1 flex-col gap-4 pt-16">
						<h1 className="font-f37-stout text-6xl">
							The AI-powered developer experience
						</h1>
						<p className="text-base text-foreground/60">
							Consistent is the open-source AI support framework that lives
							inside your product — not trapped in a floating iframe.
						</p>
						<Button
							className="mt-4 h-16 w-[300px] justify-between has-[>svg]:px-4"
							size="lg"
						>
							Join the waitlist
							<Icon
								className="size-4 transition-transform group-hover/btn:translate-x-1"
								name="arrow-right"
							/>
						</Button>
						<p className="text-foreground/60 text-sm">
							Already 28 people on the waitlist. Join them, be early.
						</p>
					</div>

					<div className="flex items-center justify-start">
						<ComponentPreview name="support-widget" withOrnament />
					</div>
				</div>
			</div>
		</>
	);
}
