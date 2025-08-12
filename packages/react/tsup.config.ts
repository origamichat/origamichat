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
	// Use neutral so the lib works in both browser + SSR bundles
	platform: "neutral",
	splitting: false,
	sourcemap: true,
	minify: true,
	external: [
		// React ecosystem
		"react",
		"react-dom",
		"react/jsx-runtime",

		// TanStack Query (peer)
		"@tanstack/react-query",

		// Motion (root and subpath)
		"motion",
		"motion/*",

		// workspace packages (so we don’t inline them)
		"@cossistant/*",

		"react-use-websocket",
		"clsx",
		"zod",
		"react-markdown",
		"zustand",
		"zustand/middleware",
		"nanoid",
	],
});
