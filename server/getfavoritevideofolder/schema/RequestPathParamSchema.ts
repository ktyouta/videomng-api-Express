import { z } from "zod";

export const RequestPathParamSchema = z.object({
    folderId: z
        .string()
        .regex(/^\d+$/, "フォルダIDが不正です。(数値以外)")
        .transform((val) => Number(val))
        .refine((val) => val > 0, "フォルダIDが不正です。(負の値)")
});

export type RequestPathParamType = z.infer<typeof RequestPathParamSchema>;