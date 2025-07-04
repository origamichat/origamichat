import Link from "next/link";
import { getAuth } from "@/lib/auth/server";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export function DashboardButtonSkeleton() {
	return (
		<Button className="min-w-24 rounded-full">
			<Skeleton className="size-4" />
		</Button>
	);
}

export async function DashboardButton() {
	const { user } = await getAuth();

	if (!user) {
		return (
			<Link href="/">
				<Button className="rounded-full">Join the waitlist</Button>
			</Link>
		);
	}

	console.log(user);

	return (
		<Link href="/select">
			<Button className="h-auto rounded-full p-1 pr-3">
				<Avatar className="size-7">
					{user.image && <AvatarImage src={user.image} />}
					<AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
				</Avatar>
				Dashboard
			</Button>
		</Link>
	);
}
