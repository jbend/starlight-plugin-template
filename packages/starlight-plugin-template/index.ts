import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { StarlightPlugin } from "@astrojs/starlight/types";
import type { StarlightGTMConfig } from "./libs/config";
import { StarlightGTMConfigSchema } from "./libs/config";
import { vitePluginStarlightGTM } from "./libs/vite";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type { StarlightGTMConfig } from "./libs/config";

export default function starlightGTMPlugin(
	userConfig?: StarlightGTMConfig,
): StarlightPlugin {
	const starlightGTMConfig = StarlightGTMConfigSchema.safeParse(userConfig);

	// Get absolute path to the SkipLink component
	const skipLinkPath = join(__dirname, "overrides", "SkipLink.astro");

	return {
		name: "starlight-gtm",
		hooks: {
			"config:setup": async ({ updateConfig, logger, addIntegration }) => {
				const parsedSuccess = starlightGTMConfig.success;
				if (!parsedSuccess) {
					logger.error(`${starlightGTMConfig.error.message}`);
					return;
				}

				const gtmId = starlightGTMConfig.data?.gtmId;

				logger.info(`Reading GTM ID: ${gtmId}`);

				// GTM script for head
				const gtmHeadScript = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;

				updateConfig({
					components: {
						SkipLink: skipLinkPath,
					},
					head: [
						{
							tag: "script",
							content: gtmHeadScript,
						},
					],
				});

				addIntegration({
					name: "starlight-gtm-integration",
					hooks: {
						"astro:config:setup": ({ updateConfig }) => {
							updateConfig({
								vite: {
									plugins: [vitePluginStarlightGTM(starlightGTMConfig.data)],
								},
							});
						},
					},
				});
			},
		},
	};
}
