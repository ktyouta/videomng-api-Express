import { z } from "zod";
import { VideoType } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType";

const VideoTypeSchema = z.custom<VideoType>(
  (val) => val === "all" || val === "live"
);

export const RequestQuerySchema = z.object({
  q: z.string().min(1, "qは必須です。"),
  videoType: z
    .union([z.literal("all"), z.literal("live"), z.literal("")])
    .optional()
    .transform((v): VideoType => {
      if (!v) return "all";
      return v;
    }),
  nextPageToken: z.string().optional().default(""),
  videoCategory: z.string().optional().default(""),
});

export type RequestQueryType = z.infer<typeof RequestQuerySchema>;