import { z } from "zod";

// ユーザー情報登録時のリクエストのバリデーションチェック用
export const FrontUserInfoCreateRequestModelSchema = z.object({
    userName: z.string().min(1, "userNameは必須です。"),
    password: z.string().min(1, "passwordは必須です。"),
    userBirthday: z.string().regex(/^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/, "userBirthdayは日付形式(yyyyMMdd)である必要があります。"),
});