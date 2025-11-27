import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { StarlightTemplateConfig } from "./libs/config";
import { StarlightTemplateConfigSchema } from "./libs/config";
import { vitePluginStarlightTemplate } from "./libs/vite";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type { StarlightTemplateConfig } from "./libs/config";

export default function starlightTemplatePlugin(
	userConfig?: StarlightTemplateConfig,
): StarlightPlugin {
	const starlightTemplateConfig =
		StarlightTemplateConfigSchema.safeParse(userConfig);

	// Get absolute path to the component
	const accentSectionPath = join(
		__dirname,
		"components",
		"AccentSection.astro",
	);

	return {
		name: "starlight-plugin-template",
		hooks: {
			"config:setup": async ({
				updateConfig,
				logger,
				addIntegration,
				config: starlightConfig,
			}) => {
				const parsedSuccess = starlightTemplateConfig.success;
				if (!parsedSuccess) {
					logger.error(`${starlightTemplateConfig.error.message}`);
					return;
				}

				const templateParameter =
					starlightTemplateConfig.data?.templateParameter;

				logger.info(`Reading template parameter: ${templateParameter}`);

				updateConfig({
					components: {
						AccentSection: accentSectionPath,
						...starlightConfig.components,
					},
				});

				addIntegration({
					name: "starlight-template-integration",
					hooks: {
						"astro:config:setup": ({ updateConfig }) => {
							updateConfig({
								vite: {
									plugins: [
										vitePluginStarlightTemplate(starlightTemplateConfig.data),
									],
								},
							});
						},
					},
				});
			},
		},
	};
}
