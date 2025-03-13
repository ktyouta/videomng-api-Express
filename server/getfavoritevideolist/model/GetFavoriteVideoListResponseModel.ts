import { FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoListMergedType } from "./FavoriteVideoListMergedType";

export class GetFavoriteVideoListResponseModel {

    private readonly _data: FavoriteVideoTransaction[];

    constructor(favoriteVideoListMergedList: FavoriteVideoListMergedType[]) {

        this._data = favoriteVideoListMergedList;
    }

    get data() {
        return this._data;
    }
}