import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";
import { FolderShareVideosResponseDataType } from "./FolderShareVideosResponseDataType";

export class FolderShareVideosResponseModel {

    private readonly _data: FolderShareVideosResponseDataType;

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[]) {

        this._data = {
            item: favoriteVideoListMergedList,
        };
    }

    get data() {
        return this._data;
    }
}