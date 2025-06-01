import { YouTubeDataApiVideoListItemType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType";

export type GetChannelVideoListItemType = YouTubeDataApiVideoListItemType & {
    favoriteFlg: string,
}