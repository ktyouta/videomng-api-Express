import { z } from "zod";

export const CreateFolderRequestSchema = z.object({
    name: z.string().min(1, "フォルダ名を入力してください。"),
    folderColor: z.string(),
});

export type CreateFolderRequestType = z.infer<typeof CreateFolderRequestSchema>;