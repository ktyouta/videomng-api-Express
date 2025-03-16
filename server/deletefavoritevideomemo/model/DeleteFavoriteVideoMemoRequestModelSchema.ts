import { z } from "zod";

// お気に入り動画登録時のリクエストのバリデーションチェック用
export const DeleteFavoriteVideoMemoRequestModelSchema = z.object({
    videoId: z.string().min(1, "videoIdは必須です。"),
    videoMemoSeq: z.number().min(0, "videoMemoSeqは必須です。"),
});