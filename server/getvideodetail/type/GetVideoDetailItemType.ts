import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";

export type GetVideoDetailItemType = YouTubeDataApiVideoDetailItemType & {
    favoriteFlg: string,
}