import { z } from "zod";

// ユーザー情報登録時のリクエストのバリデーションチェック用
export const FrontUserInfoUpdateRequestModelSchema = z.object({
    userName: z.string().min(1, "ユーザー名は必須です"),
    userBirthday: z.string().regex(/^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/, "生年月日は日付形式(yyyyMMdd)である必要があります"),
});