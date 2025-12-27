import { z } from "zod";

export const RequestQuerySchema = z.object({
  folderViewStatus: z.string().optional().default(""),
  folderVideoCategory: z.string().optional().default(""),
  folderVideoTag: z.string().optional().default(""),
  folderFavoriteLevel: z.string().optional().default(""),
  folderPage: z.string().optional().default(""),
  folderSortKey: z.string().optional().default(""),
});

export type RequestQueryType =
  z.infer<typeof RequestQuerySchema>;
