import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoDetailCategoryType } from "../type/FavoriteVideoDetailCategoryType";
import { FavoriteVideoFolderType } from "../type/FavoriteVideoFolderType";
import { FavoriteVideoTagType } from "../type/FavoriteVideoTagType";

export class FavoriteVideoCustomMergedModel {

    private readonly detail: FavoriteVideoTransaction;
    private readonly memos: FavoriteVideoMemoTransaction[];
    private readonly categorys: FavoriteVideoDetailCategoryType[];
    private readonly tags: FavoriteVideoTagType[];
    private readonly folders: FavoriteVideoFolderType[][];

    constructor(favoriteVideoList: FavoriteVideoTransaction[],
        favoriteVideoMemoList: FavoriteVideoMemoTransaction[],
        favoriteVideoCategoryList: FavoriteVideoDetailCategoryType[],
        favoriteVideoTagList: FavoriteVideoTagType[],
        favoriteVideoFolderList: FavoriteVideoFolderType[][],
    ) {

        if (favoriteVideoList.length === 0) {
            throw Error(`お気に入り動画情報が存在しません。`);
        }

        this.detail = favoriteVideoList[0];
        this.memos = favoriteVideoMemoList;
        this.categorys = favoriteVideoCategoryList;
        this.tags = favoriteVideoTagList;
        this.folders = favoriteVideoFolderList;
    }
}