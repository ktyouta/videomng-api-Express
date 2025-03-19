import { FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";

// お気に入り動画情報と外部APIの動画情報をマージした型
export type FavoriteVideoListMergedType =
    FavoriteVideoTransaction & YouTubeDataApiVideoDetailItemType;