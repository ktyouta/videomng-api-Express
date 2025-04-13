import { FavoriteVideoTagType } from "../type/FavoriteVideoTagType";

export class GetFavoriteVideoTagListResponseModel {

    private readonly _data: FavoriteVideoTagType[];

    constructor(favoriteVideoTagList: FavoriteVideoTagType[]) {

        this._data = favoriteVideoTagList;
    }

    get data() {
        return this._data;
    }
}