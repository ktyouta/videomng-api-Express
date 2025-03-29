import { z } from "zod";

// お気に入りコメント登録時のリクエストのバリデーションチェック用
export const CreateFavoriteCommentRequestModelSchema = z.object({
    commentId: z.string().min(1, "commentIdは必須です。"),
});