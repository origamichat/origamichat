import Link from "next/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
			<div className="flex flex-col items-center gap-6 text-center">
				<h1 className="font-f37-stout text-8xl leading-tight lg:text-9xl">
					404
				</h1>
				<h2 className="font-f37-stout text-2xl leading-tight lg:text-4xl">
					Page not found
				</h2>
				<p className="max-w-[500px] text-balance text-lg text-primary/70">
					Looks like you've wandered into uncharted territory. The page you're
					looking for doesn't exist or has been moved.
				</p>
				<div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
					<Link href="/">
						<Button
							className="h-12 w-[200px] justify-between border border-transparent font-medium has-[>svg]:px-4"
							size="lg"
						>
							Go home
							<Icon
								className="size-4 transition-transform group-hover/btn:translate-x-1"
								name="arrow-right"
							/>
						</Button>
					</Link>
					<Link href="/docs">
						<Button
							className="h-12 w-[200px] font-medium"
							size="lg"
							variant="outline"
						>
							View docs
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
