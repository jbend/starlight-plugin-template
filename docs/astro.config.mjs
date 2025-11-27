// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPluginTemplate from "starlight-plugin-template";

// https://astro.build/config
export default defineConfig({
	site: 'https://starlight-plugin-template.github.io',
	base: '/starlight-plugin-template',
	integrations: [
		starlight({
			title: "Plugin Template",
			plugins: [
				starlightPluginTemplate({ 
					templateParameter: "Hello, Starlight!" 
			})],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/withastro/starlight",
				},
			],
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "Getting Started", slug: "guides/getting-started" },
					],
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
