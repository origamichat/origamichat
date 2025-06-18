"use client";

import { useState } from "react";
import WebsiteCreationForm from "./website-creation-form";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc/client";
import { CreateWebsiteResponse } from "@api/schemas";

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
      <WebsiteCreationForm
        onSubmit={createWebsite}
        organizationId={organizationId}
        isSubmitting={isSubmitting}
      />
    );
  }

  return <div>Creation Flow</div>;
}
