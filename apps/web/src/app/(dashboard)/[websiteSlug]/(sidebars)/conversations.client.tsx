"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { ConversationItem } from "@/components/ui/layout/sidebars/navigation/conversation-item";
import { useTRPC } from "@/lib/trpc/client";

type ConversationsListProps = {
	websiteId: string;
	websiteSlug: string;
	scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

export function ConversationsList({
	websiteId,
	websiteSlug,
	scrollContainerRef,
}: ConversationsListProps) {
	const trpc = useTRPC();
	const pathname = usePathname();

	const query = useInfiniteQuery(
		trpc.conversation.listByWebsite.infiniteQueryOptions(
			{ websiteId, limit: 20 },
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
			}
		)
	);

	const flat = useMemo(() => {
		return query.data?.pages.flatMap((p) => p.items) ?? [];
	}, [query.data]);

	const sentinelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!query.hasNextPage) {
			return;
		}
		if (query.isFetchingNextPage) {
			return;
		}

		const root = scrollContainerRef?.current ?? null;
		const sentinel = sentinelRef.current;
		if (!sentinel) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries || entries.length === 0) {
					return;
				}
				const entry = entries[0];
				if (entry?.isIntersecting) {
					query.fetchNextPage();
				}
			},
			{
				root,
				rootMargin: "0px 0px 200px 0px",
				threshold: 0,
			}
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [
		query.hasNextPage,
		query.isFetchingNextPage,
		query.fetchNextPage,
		scrollContainerRef,
	]);

	return (
		<div className="flex flex-col gap-1">
			{flat.map((c) => {
				const href = `/${websiteSlug}/conversations/${c.id}`;
				const active = pathname === href;
				return (
					<ConversationItem
						active={active}
						href={href}
						key={c.id}
						lastMessage={c.lastMessagePreview ?? ""}
						name={c.title ?? `Conversation ${c.id}`}
						online={false}
						time={c.updatedAt}
						unread={false}
					/>
				);
			})}

			{flat.length === 0 && (
				<div className="mx-1 flex flex-col gap-1 rounded border border-primary/10 border-dashed p-2 text-center">
					<p className="text-muted-foreground text-xs">No conversations yet</p>
				</div>
			)}

			{/* Sentinel for infinite scroll */}
			<div ref={sentinelRef} />
		</div>
	);
}
