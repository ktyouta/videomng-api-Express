import { z } from "zod";

export const UpdateFolderRequestSchema = z.object({
    name: z.string().min(1, "フォルダ名を入力してください。"),
});

export type UpdateFolderRequestType = z.infer<typeof UpdateFolderRequestSchema>;