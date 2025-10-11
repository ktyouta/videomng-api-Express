import { FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";
import { GetFavoriteVideoListResponseDataType } from "./GetFavoriteVideoListResponseDataType";

export class GetFavoriteVideoListResponseModel {

    private readonly _data: GetFavoriteVideoListResponseDataType;

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[]) {

        this._data = {
            item: favoriteVideoListMergedList,
            total: 1,
            page: 1
        };
    }

    get data() {
        return this._data;
    }
}