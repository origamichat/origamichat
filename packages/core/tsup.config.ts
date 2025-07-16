import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	outDir: "dist",
	target: "es2022",
	platform: "neutral",
	splitting: false,
	sourcemap: true,
	minify: false,
	external: ["zod"],
});
