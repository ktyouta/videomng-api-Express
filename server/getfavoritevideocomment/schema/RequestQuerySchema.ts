import { z } from "zod";

export const RequestQuerySchema = z.object({
  nextpagetoken: z.string().optional().default(""),
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;