import { getAuth } from "@/lib/auth/server";
import { trpc } from "@/lib/trpc/server";

export async function WaitingListMessage() {
	const { user } = await getAuth();

	const { entry, totalEntries } = await trpc.waitlist.getWaitlistEntry.query({
		userId: user?.id,
	});

	return (
		<p className="text-balance text-center font-mono text-foreground/60 text-xs md:text-left">
			Already {totalEntries} people on the waitlist.{" "}
			{entry ? "You're in!" : "Join them, be early."}
		</p>
	);
}
