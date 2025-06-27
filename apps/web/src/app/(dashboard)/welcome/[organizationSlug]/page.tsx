import { getOrganizationBySlug } from "@api/db/queries/organization";
import { db } from "@database/database";
import { notFound } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { TextEffect } from "@/components/ui/text-effect";
import { ensurePageAuth } from "@/lib/auth/server";
import CreationFlowWrapper from "./creation-flow";

export default async function Page({
	params,
}: {
	params: Promise<{
		organizationSlug: string;
	}>;
}) {
	const { organizationSlug } = await params;

	const [organization] = await Promise.all([
		getOrganizationBySlug(db, organizationSlug),
		ensurePageAuth(),
	]);

	if (!organization) {
		notFound();
	}

	return (
		<div className="flex w-sm flex-col">
			<div className="flex items-center gap-4">
				<Logo className="size-6" />
				<span className="text-primary/30 text-sm">/</span>
				<TextEffect className="text-center font-medium text-2xl" delay={0.5}>
					Welcome to Cossistant
				</TextEffect>
			</div>

			<CreationFlowWrapper organizationId={organization.id} />
		</div>
	);
}
