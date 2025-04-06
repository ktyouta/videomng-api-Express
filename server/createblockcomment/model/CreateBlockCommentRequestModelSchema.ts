import { z } from "zod";

// お気に入り動画登録時のリクエストのバリデーションチェック用
export const CreateBlockCommentRequestModelSchema = z.object({
    commentId: z.string().min(1, "commentIdは必須です。"),
    videoId: z.string().min(1, "videoIdは必須です。"),
});