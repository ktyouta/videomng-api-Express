import { GetVideoDetailItemType } from "./GetVideoDetailItemType";

//YouTube Data Api(動画詳細)のレスポンス
export type GetVideoDetailResponseType = {
    readonly kind: string;
    readonly etag: string;
    readonly items: GetVideoDetailItemType[];
}