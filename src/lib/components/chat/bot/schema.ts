import { z } from "zod";

export const createBotFormSchema = z.object({
	name: z.string().min(2).max(50),
	description: z.string().max(2048).optional(),
});

export type CreateBotFormSchema = typeof createBotFormSchema;