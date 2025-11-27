import { z } from "zod";

const TemplateParameterSchema = z.string().min(1).max(100, {
	message: "Template parameter must be between 1 and 100 characters",
});

export const StarlightTemplateConfigSchema = z.object({
	templateParameter: TemplateParameterSchema,
});

export type StarlightTemplateUserConfig = z.infer<
	typeof StarlightTemplateConfigSchema
>;
export type StarlightTemplateConfig = z.infer<
	typeof StarlightTemplateConfigSchema
>;
