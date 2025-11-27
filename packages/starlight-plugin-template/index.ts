import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { StarlightTemplateConfig } from "@libs/config";
import { StarlightTemplateConfigSchema } from "@libs/config";
import { vitePluginStarlightTemplate } from "@libs/vite";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type { StarlightTemplateConfig } from "@libs/config";

export default function starlightTemplatePlugin(
	userConfig?: StarlightTemplateConfig,
): StarlightPlugin {
	const starlightTemplateConfig =
		StarlightTemplateConfigSchema.safeParse(userConfig);

	// Get absolute path to the SkipLink component
	const skipLinkPath = join(__dirname, "overrides", "SkipLink.astro");

	return {
		name: "starlight-gtm",
		hooks: {
			"config:setup": async ({ updateConfig, logger, addIntegration }) => {
				const parsedSuccess = starlightTemplateConfig.success;
				if (!parsedSuccess) {
					logger.error(`${starlightTemplateConfig.error.message}`);
					return;
				}

				const templateParameter =
					starlightTemplateConfig.data?.templateParameter;

				logger.info(`Reading template parameter: ${templateParameter}`);

				// updateConfig({
				// 	components: {
				// 		SkipLink: skipLinkPath,
				// 	},
				// 	head: [
				// 		{
				// 			tag: "script",
				// 			content: gtmHeadScript,
				// 		},
				// 	],
				// });

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
