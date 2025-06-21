"use client";

import type { ReactNode } from "react";

import { TRPCReactProvider } from "@/lib/trpc/client";
import { RootProvider } from "fumadocs-ui/provider";

type ProviderProps = {
  //   locale: string;
  children: ReactNode;
};

export function Providers({ children }: ProviderProps) {
  return (
    <RootProvider
      theme={{
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        disableTransitionOnChange: true,
      }}
    >
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </RootProvider>
  );
}
