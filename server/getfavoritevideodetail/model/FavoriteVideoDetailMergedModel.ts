import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";

export class FavoriteVideoDetailMergedModel {

    private readonly detail: FavoriteVideoTransaction;
    private readonly memos: FavoriteVideoMemoTransaction[];
    private readonly item: YouTubeDataApiVideoDetailItemType;

    constructor(favoriteVideoList: FavoriteVideoTransaction[],
        favoriteVideoMemoList: FavoriteVideoMemoTransaction[],
        youtubeVideoItemList: YouTubeDataApiVideoDetailItemType[]) {

        if (favoriteVideoList.length === 0) {
            throw Error(`お気に入り動画情報が存在しません。`);
        }

        if (youtubeVideoItemList.length === 0) {
            throw Error(`YouTube Data Apiの動画情報が存在しません。`);
        }

        this.detail = favoriteVideoList[0];
        this.memos = favoriteVideoMemoList;
        this.item = youtubeVideoItemList[0];
    }
}