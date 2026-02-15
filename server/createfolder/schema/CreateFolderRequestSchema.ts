import { z } from "zod";

export const CreateFolderRequestSchema = z.object({
    name: z.string().min(1, "フォルダ名を入力してください。"),
    folderColor: z.string(),
    parentFolderId: z
        .string()
        .regex(/^\d+$/, "親フォルダIDは数値で指定してください。")
        .transform((val) => parseInt(val, 10))
        .refine((val) => val >= 1, "親フォルダIDは1以上で指定してください。")
        .optional(),
});

export type CreateFolderRequestType = z.infer<typeof CreateFolderRequestSchema>;