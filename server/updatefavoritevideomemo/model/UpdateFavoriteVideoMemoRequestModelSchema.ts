import { z } from "zod";

// お気に入り動画更新時のリクエストのバリデーションチェック用
export const UpdateFavoriteVideoMemoRequestModelSchema = z.object({
    memo: z.string().min(1, "memoは必須です。"),
});