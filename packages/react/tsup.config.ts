import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"support/index": "src/support/index.tsx",
		"primitive/index": "src/primitive/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	outDir: "dist",
	target: "es2020",
	platform: "browser",
	splitting: false,
	sourcemap: true,
	minify: false,
	external: ["react", "react-dom", "motion/react", "clsx", "zod"],
});
