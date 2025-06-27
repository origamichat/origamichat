"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { TRPCReactProvider } from "@/lib/trpc/client";

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
