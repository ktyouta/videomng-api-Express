import { FavoriteVideoFolderThumbnailType } from "./FavoriteVideoFolderThumbnailType";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";
import { GetFavoriteVideoFolderResponseDataType } from "./GetFavoriteVideoListResponseDataType";

export class GetFavoriteVideoFolderResponseModel {

    private readonly _data: GetFavoriteVideoFolderResponseDataType;

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[],
        total: number,
        defaultListLimit: number,
        folderList: FavoriteVideoFolderThumbnailType[],
    ) {

        this._data = {
            total,
            page: Math.ceil(total / defaultListLimit),
            item: favoriteVideoListMergedList,
            folder: folderList,
        };
    }

    get data() {
        return this._data;
    }
}