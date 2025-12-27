import { z } from "zod";

export const RequestQuerySchema = z.object({
  q: z.string().min(1, "qは必須です。"),
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;