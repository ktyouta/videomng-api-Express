import { z } from "zod";

// お気に入り動画更新時のリクエストのバリデーションチェック用
export const UpdateFavoriteVideoMemoRequestModelSchema = z.object({
    videoId: z.string().min(1, "videoIdは必須です。"),
    videoMemoSeq: z.number().min(0, "videoMemoSeqは必須です。"),
    memo: z.string().min(1, "memoは必須です。"),
});