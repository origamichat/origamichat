"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

import { TRPCReactProvider } from "@/lib/trpc/client";

type ProviderProps = {
  //   locale: string;
  children: ReactNode;
};

export function Providers({ children }: ProviderProps) {
  return (
    <TRPCReactProvider>
      {/* <I18nProviderClient locale={locale}> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      {/* </I18nProviderClient> */}
    </TRPCReactProvider>
  );
}
