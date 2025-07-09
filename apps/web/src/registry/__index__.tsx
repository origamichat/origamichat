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
	"support-widget": {
		name: "support-widget",
		component: React.lazy(() => import("@/components/support/widget")),
		path: "src/components/support/widget.tsx",
	},
};
