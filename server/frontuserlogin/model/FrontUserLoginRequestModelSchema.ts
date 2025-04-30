import { z } from "zod";

// ログイン時のリクエストのバリデーションチェック用
export const FrontUserLoginRequestModelSchema = z.object({
    userName: z.string().min(1, "ユーザー名は必須です。"),
    password: z.string().min(1, "パスワードは必須です。"),
});