import { findNeighbour } from "fumadocs-core/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons";
import { ThreeLogo } from "@/components/ui/three-logo";
import { source } from "@/lib/source";
import { absoluteUrl } from "@/lib/utils";
import { DocsTableOfContents } from "../../components/docs/docs-toc";
import { mdxComponents } from "../../components/docs/mdx-components";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);

	if (!page) {
		notFound();
	}

	const doc = page.data;

	if (!(doc.title && doc.description)) {
		notFound();
	}

	return {
		title: doc.title,
		description: doc.description,
		openGraph: {
			title: doc.title,
			description: doc.description,
			type: "article",
			url: absoluteUrl(page.url),
			images: [
				{
					url: `/og?title=${encodeURIComponent(
						doc.title
					)}&description=${encodeURIComponent(doc.description)}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: doc.title,
			description: doc.description,
			images: [
				{
					url: `/og?title=${encodeURIComponent(
						doc.title
					)}&description=${encodeURIComponent(doc.description)}`,
				},
			],
			creator: "@shadcn",
		},
	};
}

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) {
		notFound();
	}

	const doc = page.data;
	const MDX = doc.body;
	const neighbours = await findNeighbour(source.pageTree, page.url);

	// @ts-expect-error - revisit fumadocs types.
	const links = doc.links;

	return (
		<div
			className="flex items-stretch py-30 text-[1.05rem] sm:text-[15px] xl:w-full"
			data-slot="docs"
		>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="h-(--top-spacing) shrink-0" />
				<div className="mx-auto flex w-full min-w-0 max-w-2xl flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
					{!params.slug && <ThreeLogo />}
					<div className="flex flex-col gap-2">
						<div className="flex flex-col gap-2">
							<div className="flex items-start justify-between">
								<h1 className="scroll-m-20 font-medium text-4xl tracking-tight sm:text-3xl xl:text-4xl">
									{doc.title}
								</h1>
								<div className="flex items-center gap-2 pt-1.5">
									{neighbours.previous && (
										<Button
											asChild
											className="extend-touch-target size-8 shadow-none md:size-7"
											size="icon"
											variant="secondary"
										>
											<Link href={neighbours.previous.url}>
												<Icon name="arrow-left" />
												<span className="sr-only">Previous</span>
											</Link>
										</Button>
									)}
									{neighbours.next && (
										<Button
											asChild
											className="extend-touch-target size-8 shadow-none md:size-7"
											size="icon"
											variant="secondary"
										>
											<Link href={neighbours.next.url}>
												<span className="sr-only">Next</span>
												<Icon name="arrow-right" />
											</Link>
										</Button>
									)}
								</div>
							</div>
							{doc.description && (
								<p className="text-balance text-[1.05rem] text-muted-foreground sm:text-base">
									{doc.description}
								</p>
							)}
						</div>
						{links ? (
							<div className="flex items-center space-x-2 pt-4">
								{links?.doc && (
									<Badge asChild variant="secondary">
										<Link href={links.doc} rel="noreferrer" target="_blank">
											Docs <Icon name="arrow-up-right" />
										</Link>
									</Badge>
								)}
								{links?.api && (
									<Badge asChild variant="secondary">
										<Link href={links.api} rel="noreferrer" target="_blank">
											API Reference <Icon name="arrow-up-right" />
										</Link>
									</Badge>
								)}
							</div>
						) : null}
					</div>
					<div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
						<MDX components={mdxComponents} />
					</div>
				</div>
				<div className="mx-auto flex h-16 w-full max-w-2xl items-center gap-2 px-4 md:px-0">
					{neighbours.previous && (
						<Button
							asChild
							className="shadow-none"
							size="sm"
							variant="secondary"
						>
							<Link href={neighbours.previous.url}>
								<Icon name="arrow-left" /> {neighbours.previous.name}
							</Link>
						</Button>
					)}
					{neighbours.next && (
						<Button
							asChild
							className="ml-auto shadow-none"
							size="sm"
							variant="secondary"
						>
							<Link href={neighbours.next.url}>
								{neighbours.next.name} <Icon name="arrow-right" />
							</Link>
						</Button>
					)}
				</div>
			</div>
			<div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
				<div className="h-(--top-spacing) shrink-0" />
				{doc.toc?.length ? (
					<div className="no-scrollbar overflow-y-auto px-8">
						<DocsTableOfContents toc={doc.toc} />
						<div className="h-12" />
					</div>
				) : null}
				{/* <div className="flex flex-1 flex-col gap-12 px-6">
          <OpenInV0Cta />
        </div> */}
			</div>
		</div>
	);
}
