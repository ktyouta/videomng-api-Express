import { z } from "zod";

// パスワード更新時のリクエストのバリデーションチェック用
export const UpdateFrontUserPasswordRequestModelSchema = z.object({
    currentPassword: z.string().min(1, "現在のパスワードを入力してください。"),
    newPassword: z.string().min(3, "新しいパスワードは3文字以上で入力してください。").max(30, "新しいパスワードは30文字以内で入力してください。"),
    confirmPassword: z.string().min(3, "パスワード(確認用)は3文字以上で入力してください。").max(30, "パスワード(確認用)は30文字以内で入力してください。"),
});
