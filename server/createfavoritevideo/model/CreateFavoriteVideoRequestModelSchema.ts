import { z } from "zod";

// お気に入り動画登録時のリクエストのバリデーションチェック用
export const CreateFavoriteVideoRequestModelSchema = z.object({
    videoId: z.string().min(1, "videoIdは必須です。"),
});