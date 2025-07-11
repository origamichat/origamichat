import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"support/index": "src/support/index.ts",
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
});
