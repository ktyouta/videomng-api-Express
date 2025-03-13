import { FavoriteVideoCommentTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailItemType";

export class FavoriteVideoDetailMergedModel {

    private readonly detail: FavoriteVideoTransaction;
    private readonly comments: FavoriteVideoCommentTransaction[];
    private readonly item: YouTubeDataApiVideoDetailItemType;

    constructor(favoriteVideoList: FavoriteVideoTransaction[],
        favoriteVideoCommentList: FavoriteVideoCommentTransaction[],
        youtubeVideoItemList: YouTubeDataApiVideoDetailItemType[]) {

        if (favoriteVideoList.length === 0) {
            throw Error(`お気に入り動画情報が存在しません。`);
        }

        if (youtubeVideoItemList.length === 0) {
            throw Error(`YouTube Data Apiの動画情報が存在しません。`);
        }

        this.detail = favoriteVideoList[0];
        this.comments = favoriteVideoCommentList;
        this.item = youtubeVideoItemList[0];
    }
}