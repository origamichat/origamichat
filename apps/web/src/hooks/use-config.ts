import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ConfigState = {
	packageManager: "npm" | "yarn" | "pnpm" | "bun";
	installationType: "cli" | "manual";
	installationTarget: "nextjs" | "remix" | "react";
	setConfig: (config: Partial<ConfigState>) => void;
};

export const useConfigState = create<ConfigState>()(
	persist(
		(set) => ({
			packageManager: "pnpm",
			installationType: "cli",
			installationTarget: "nextjs",
			setConfig: (config: Partial<ConfigState>) => set(config),
		}),
		{
			name: "config-state",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export const useConfig = () => {
	const config = useConfigState();
	const setConfig = useConfigState((state) => state.setConfig);

	return [config, setConfig] as const;
};
