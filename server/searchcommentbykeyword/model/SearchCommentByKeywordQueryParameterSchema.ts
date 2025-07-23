import { z } from "zod";

// YouTube動画検索時のクエリパラメータのバリデーションチェック用
export const SearchCommentByKeywordQueryParameterSchema = z.object({
    q: z.string().min(1, "qは必須です。"),
});