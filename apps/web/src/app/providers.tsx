"use client";

import { RootProvider } from "fumadocs-ui/provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { TRPCReactProvider } from "@/lib/trpc/client";

type ProviderProps = {
	//   locale: string;
	children: ReactNode;
};

export function Providers({ children }: ProviderProps) {
	return (
		<NuqsAdapter>
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
		</NuqsAdapter>
	);
}
