import { z } from "zod";

export const PathParamSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "お気に入りワードIDが不正です。(数値以外)")
        .transform((val) => Number(val))
        .refine((val) => val > 0, "お気に入りワードIDが不正です。(負の値)"),
});

export type PathParamType = z.infer<typeof PathParamSchema>;
