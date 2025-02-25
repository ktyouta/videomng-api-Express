import { YouTubeDataApiVideoDetailItemType } from "./YouTubeDataApiVideoDetailItemType";

//YouTube Data Api(動画詳細)のレスポンス
export type YouTubeDataApiVideoDetailResponseType = {
    readonly kind: string;
    readonly etag: string;
    readonly items: YouTubeDataApiVideoDetailItemType[];
}