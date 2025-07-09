import fs from "node:fs/promises";
import path from "node:path";
import type * as React from "react";
import { CopyButton } from "@/components/copy-button";
import { highlightCode } from "@/lib/highlight-code";
import { cn } from "@/lib/utils";
import { Index } from "@/registry/__index__";

export async function ComponentSource({
  name,
  className,
}: React.ComponentProps<"div"> & {
  name: string;
}) {
  const item = Index[name];
  if (!item) {
    return null;
  }

  const fullPath = path.join(process.cwd(), item.path);
  const code = await fs.readFile(fullPath, "utf-8");
  const highlightedCode = await highlightCode(code, "tsx");

  return (
    <div className={cn("relative", className)}>
      <ComponentCode code={code} highlightedCode={highlightedCode} />
    </div>
  );
}

function ComponentCode({
  code,
  highlightedCode,
}: {
  code: string;
  highlightedCode: string;
}) {
  return (
    <figure
      className="[&>pre]:max-h-96 [&>pre]:overflow-auto"
      data-rehype-pretty-code-figure=""
    >
      <CopyButton value={code} />
      {/** biome-ignore lint/security/noDangerouslySetInnerHtml: ok */}
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </figure>
  );
}
