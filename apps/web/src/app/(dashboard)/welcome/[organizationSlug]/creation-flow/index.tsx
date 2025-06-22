"use client";

import { useState } from "react";
import WebsiteCreationForm from "./website-creation-form";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { CreateWebsiteResponse } from "@api/schemas";
import { motion } from "motion/react";

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <WebsiteCreationForm
          onSubmit={createWebsite}
          organizationId={organizationId}
          isSubmitting={isSubmitting}
        />
      </motion.div>
    );
  }

  return <div>Creation Flow</div>;
}
