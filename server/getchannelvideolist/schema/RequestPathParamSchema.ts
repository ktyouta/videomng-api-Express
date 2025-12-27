import { z } from "zod";

export const RequestPathParamSchema = z.object({
    id: z.string().min(1, "チャンネルIDが指定されていません。"),
});

export type RequestPathParamType = z.infer<typeof RequestPathParamSchema>;