"use client";

import { useState } from "react";

export default function CreationFlowWrapper() {
  const [step, setStep] = useState<"create-website" | "install-library">(
    "create-website"
  );

  if (step === "create-website") {
    return <CreateWebsiteStep />;
  }

  return <div>Creation Flow</div>;
}
