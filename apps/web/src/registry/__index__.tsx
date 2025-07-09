import * as React from "react";

export const Index: Record<
  string,
  {
    name: string;
    description: string;
    // biome-ignore lint/suspicious/noExplicitAny: ok
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    files: {
      path: string;
      type: string;
      target: string;
    }[];
  }
> = {
  "support-widget": {
    name: "support-widget",
    description: "",
    component: React.lazy(async () => {
      const mod = await import("@/components/support/widget");
      return { default: mod.default };
    }),
    files: [
      {
        path: "components/support/widget.tsx",
        type: "registry:ui",
        target: "",
      },
    ],
  },
};
