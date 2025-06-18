import { Logo } from "@/components/ui/logo";
import { TextEffect } from "@/components/ui/text-effect";
import { getOrganizationBySlug } from "@api/db/queries/organization";
import { db } from "@database/database";

import { notFound } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default async function Page({
  params,
}: {
  params: Promise<{
    organizationSlug: string;
  }>;
}) {
  const { organizationSlug } = await params;

  const organization = await getOrganizationBySlug(db, organizationSlug);

  if (!organization) {
    notFound();
  }

  return (
    <div className="flex flex-col w-sm">
      <div className="flex items-center gap-4">
        <Logo className="size-6" />
        <span className="text-primary/30 text-sm">/</span>
        <TextEffect className="text-center text-2xl font-medium" delay={1}>
          Welcome to Origami
        </TextEffect>
      </div>
    </div>
  );
}
