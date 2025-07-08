"use client";

import type { CreateWebsiteResponse } from "@api/schemas";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { useTRPC } from "@/lib/trpc/client";
import WebsiteCreationForm from "./website-creation-form";

type CreationFlowWrapperProps = {
	organizationId: string;
};

export default function CreationFlowWrapper({
	organizationId,
}: CreationFlowWrapperProps) {
	const trpc = useTRPC();
	const [website, setWebsite] = useState<CreateWebsiteResponse | null>(null);

	const { mutate: createWebsite, isPending: isSubmitting } = useMutation(
		trpc.website.create.mutationOptions({
			onSuccess: (data) => {
				setWebsite(data);
			},
		})
	);

	if (!website) {
		return (
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				initial={{ opacity: 0, y: 10 }}
				transition={{ duration: 0.5, delay: 1 }}
			>
				<WebsiteCreationForm
					isSubmitting={isSubmitting}
					onSubmit={createWebsite}
					organizationId={organizationId}
				/>
			</motion.div>
		);
	}

	console.log({ website });

	return <div>Creation Flow</div>;
}
