import { z } from "zod";

// お気に入り動画更新時のリクエストのバリデーションチェック用
export const UpdateFavoriteVideoRequestModelSchema = z.object({
    comments: z.array(z.string()),
});