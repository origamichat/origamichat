import { generateSiteMetadata } from "@/lib/metadata";
import { trpc } from "@/lib/trpc/server";
import { WaitlistForm } from "../components/waiting-list/waitlist-form";

export const dynamic = "force-dynamic";

export const metadata = generateSiteMetadata({
	title: "Join the waitlist",
});

export default async function Page() {
	const { totalEntries } = await trpc.waitlist.getWaitlistEntry.query({
		userId: undefined,
	});

	return (
		<main className="flex min-h-[80vh] flex-col gap-6 px-6 pt-20 md:pt-48">
			<WaitlistForm totalEntries={totalEntries} />
		</main>
	);
}
