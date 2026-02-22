import { z } from "zod";

export const RequestQuerySchema = z.object({
  viewStatus: z.string().optional().default(""),
  videoCategory: z.string().optional().default(""),
  videoTag: z.string().optional().default(""),
  favoriteLevel: z.string().optional().default(""),
  page: z.string().optional().default(""),
  sortKey: z.string().optional().default(""),
  folder: z.string().optional().default(""),
  mode: z.string().optional().default(""),
});

export type RequestQueryType =
  z.infer<typeof RequestQuerySchema>;
