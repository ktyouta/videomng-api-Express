import { YouTubeDataApiVideoListItemType } from "../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType";

export type GetVideoListItemType = YouTubeDataApiVideoListItemType & {
    favoriteFlg: string,
}