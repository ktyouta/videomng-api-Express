import { z } from "zod";

export const RequestPathParamSchema = z.object({
    videoId: z.string().min(1, "動画IDが指定されていません。"),
});

export type RequestPathParamType = z.infer<typeof RequestPathParamSchema>;