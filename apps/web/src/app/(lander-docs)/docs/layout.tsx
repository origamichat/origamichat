import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/(lander-docs)/docs/layout.config";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.pageTree}
			{...baseOptions}
			nav={{ transparentMode: "top" }}
			sidebar={{ hidden: false, collapsible: false }}
		>
			{children}
		</DocsLayout>
	);
}
