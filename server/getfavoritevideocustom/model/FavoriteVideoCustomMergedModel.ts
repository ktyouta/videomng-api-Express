import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";
import { FavoriteVideoDetailCategoryType } from "../type/FavoriteVideoDetailCategoryType";

export class FavoriteVideoCustomMergedModel {

    private readonly detail: FavoriteVideoTransaction;
    private readonly memos: FavoriteVideoMemoTransaction[];
    private readonly categorys: FavoriteVideoDetailCategoryType[];

    constructor(favoriteVideoList: FavoriteVideoTransaction[],
        favoriteVideoMemoList: FavoriteVideoMemoTransaction[],
        favoriteVideoCategoryList: FavoriteVideoDetailCategoryType[]) {

        if (favoriteVideoList.length === 0) {
            throw Error(`お気に入り動画情報が存在しません。`);
        }

        this.detail = favoriteVideoList[0];
        this.memos = favoriteVideoMemoList;
        this.categorys = favoriteVideoCategoryList;
    }
}