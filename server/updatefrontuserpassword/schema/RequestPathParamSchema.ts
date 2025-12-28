import { z } from "zod";

export const RequestPathParamSchema = z.object({
    id: z.string().min(1, "ユーザーIDが指定されていません。"),
});

export type RequestPathParamType = z.infer<typeof RequestPathParamSchema>;