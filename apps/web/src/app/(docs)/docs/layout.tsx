import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { baseOptions } from "@/app/(docs)/layout.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      sidebar={{ hidden: false, collapsible: false }}
      nav={{ transparentMode: "top" }}
    >
      {children}
    </DocsLayout>
  );
}
