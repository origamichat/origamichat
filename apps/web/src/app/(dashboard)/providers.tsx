"use client";

import type { ReactNode } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { HotkeysProvider } from "react-hotkeys-hook";

type ProviderProps = {
  //   locale: string;
  children: ReactNode;
};

export function Providers({ children }: ProviderProps) {
  return (
    <HotkeysProvider>
      <TRPCReactProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </TRPCReactProvider>
    </HotkeysProvider>
  );
}
