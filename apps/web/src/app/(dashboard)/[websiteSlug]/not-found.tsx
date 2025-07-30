import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="text-center">
				<h1 className="mb-4 font-bold text-4xl">Access Denied</h1>
				<p className="mb-8 text-muted-foreground">
					You don't have access to this website or it doesn't exist.
				</p>
				<Link href="/select">
					<Button>Go to Website Selection</Button>
				</Link>
			</div>
		</div>
	);
}
