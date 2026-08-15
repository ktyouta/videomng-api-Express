import { z } from "zod";

export const PathParamSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "検索実績IDが不正です。(数値以外)")
        .transform((val) => Number(val))
        .refine((val) => val > 0, "検索実績IDが不正です。(負の値)"),
});

export type PathParamType = z.infer<typeof PathParamSchema>;
