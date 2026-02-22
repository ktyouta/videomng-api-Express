import { z } from "zod";

export const RequestQuerySchema = z.object({
    parentFolderId: z
        .string()
        .regex(/^\d+$/, "親フォルダIDは数値で指定してください。")
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1, "親フォルダIDは1以上で指定してください。")
        .optional(),
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;