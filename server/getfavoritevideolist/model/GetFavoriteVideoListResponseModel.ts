import { FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";
import { GetFavoriteVideoListResponseDataType } from "./GetFavoriteVideoListResponseDataType";

export class GetFavoriteVideoListResponseModel {

    private readonly _data: GetFavoriteVideoListResponseDataType;

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[],
        total: number,
        defaultListLimit: number
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