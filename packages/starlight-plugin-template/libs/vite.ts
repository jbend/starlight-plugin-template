import type { ViteUserConfig } from "astro";

import type { StarlightTemplateConfig } from "..";

export function vitePluginStarlightTemplate(
	config: StarlightTemplateConfig,
): VitePlugin {
	const moduleId = "virtual:starlight-template-config";
	const resolvedModuleId = `\0${moduleId}`;
	const moduleContent = `export default ${JSON.stringify(config)}`;

	return {
		name: "vite-plugin-starlight-template",
		load(id) {
			return id === resolvedModuleId ? moduleContent : undefined;
		},
		resolveId(id) {
			return id === moduleId ? resolvedModuleId : undefined;
		},
	};
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
