import { FavoriteVideoTransaction, FolderMaster } from "@prisma/client";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";
import { GetFavoriteVideoFolderResponseDataType } from "./GetFavoriteVideoListResponseDataType";

export class GetFavoriteVideoFolderResponseModel {

    private readonly _data: GetFavoriteVideoFolderResponseDataType;

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[],
        total: number,
        defaultListLimit: number,
    ) {

        this._data = {
            total,
            page: Math.ceil(total / defaultListLimit),
            item: favoriteVideoListMergedList,
        };
    }

    get data() {
        return this._data;
    }
}