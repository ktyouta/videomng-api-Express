import { z } from "zod";

export const RequestSchema = z.object({
    videoId: z.string().min(1, "動画IDが指定されていません。"),
});

export type RequestType = z.infer<typeof RequestSchema>;