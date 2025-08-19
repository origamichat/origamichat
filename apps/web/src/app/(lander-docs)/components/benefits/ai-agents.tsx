"use client";

import { useTheme } from "next-themes";
import { GLOBE_CONFIG, Globe } from "../globe";

export const AiAgentsGraphic = () => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute right-0 bottom-0 left-0 z-10 h-6 bg-gradient-to-t from-background via-background to-transparent" />
      <Globe
        config={{
          ...GLOBE_CONFIG,
          dark: resolvedTheme === "dark" ? 1 : 0,
        }}
      />
    </div>
  );
};
