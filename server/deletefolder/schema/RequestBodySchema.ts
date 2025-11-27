import { z } from "zod";

export const RequestBodySchema = z.object({
    deleteVideos: z.boolean()
});

export type RequestBodyType = z.infer<typeof RequestBodySchema>;