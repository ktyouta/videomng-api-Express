import { FavoriteVideoTransaction, FolderMaster } from "@prisma/client";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";
import { GetFavoriteVideoListResponseDataType } from "./GetFavoriteVideoListResponseDataType";

export class GetFavoriteVideoListResponseModel {

    private readonly _data: GetFavoriteVideoListResponseDataType;

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[],
        total: number,
        defaultListLimit: number,
        folderList: FolderMaster[],
    ) {

        this._data = {
            total,
            page: Math.ceil(total / defaultListLimit),
            item: favoriteVideoListMergedList,
            folder: folderList
        };
    }

    get data() {
        return this._data;
    }
}