/** biome-ignore-all lint/suspicious/noExplicitAny: Ok here :) */
import * as React from "react";

export const Index: Record<
	string,
	{
		name: string;
		component: React.LazyExoticComponent<React.ComponentType<any>>;
		path: string;
	}
> = {
	support: {
		name: "support",
		component: React.lazy(() => import("@/components/support")),
		path: "src/components/support/index.tsx",
	},
};
