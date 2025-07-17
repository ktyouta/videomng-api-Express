import { z } from "zod";

// お気に入り動画登録時のリクエストのバリデーションチェック用
export const CreateFavoriteVideoMemoRequestModelSchema = z.object({
    memo: z.string().min(1, "memoは必須です。"),
});