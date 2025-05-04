import { z } from "zod";

// パスワード更新時のリクエストのバリデーションチェック用
export const UpdateFrontUserPasswordRequestModelSchema = z.object({
    currentPassword: z.string().min(1, "現在のパスワードが入力されていません"),
    newPassword: z.string().min(1, "新パスワードが入力されていません"),
    confirmPassword: z.string().min(1, "パスワード(確認用)が入力されていません"),
});