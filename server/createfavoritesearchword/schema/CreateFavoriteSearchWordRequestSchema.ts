import { z } from "zod";

export const CreateFavoriteSearchWordRequestSchema = z.object({
    word: z.string().min(1, "お気に入りワードが存在しません。"),
});

export type CreateFavoriteSearchWordRequestType = z.infer<typeof CreateFavoriteSearchWordRequestSchema>;