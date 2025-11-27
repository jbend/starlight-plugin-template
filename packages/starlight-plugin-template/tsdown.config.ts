import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./index.ts"],
	dts: true,
	format: ["esm", "cjs"],
	external: [
		// Externalize vite and its dependencies (including fsevents)
		"vite",
		"fsevents",
		// Externalize peer dependencies
		"@astrojs/starlight",
		// Externalize native modules that can't be bundled
		/^fsevents/,
	],
});
