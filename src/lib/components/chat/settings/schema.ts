import { z } from "zod";

export const settingsFormSchema = z.object({
	openai_api_key: z.string().min(2).startsWith("sk-"),
});

export type SettingsFormSchema = typeof settingsFormSchema;