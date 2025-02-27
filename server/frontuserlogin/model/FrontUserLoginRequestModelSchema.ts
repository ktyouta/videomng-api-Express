import { z } from "zod";

// ログイン時のリクエストのバリデーションチェック用
export const FrontUserLoginRequestModelSchema = z.object({
    userId: z.string().min(1, "ユーザーIDは必須です。"),
    password: z.string().min(1, "パスワードは必須です。"),
});