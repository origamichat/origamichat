"use client";

import { useTheme } from "next-themes";
import { GLOBE_CONFIG, Globe } from "../globe";

export const AiAgentsGraphic = () => {
	const { resolvedTheme } = useTheme();
	return (
		<div className="relative">
			<div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-b from-background/5 to-transparent">
				<Globe
					config={{
						...GLOBE_CONFIG,
						dark: resolvedTheme === "dark" ? 1 : 0,
					}}
				/>
			</div>
			<div className="absolute right-0 bottom-0 left-0 z-10 h-20 bg-gradient-to-t from-background via-background to-transparent" />
		</div>
	);
};
