import { FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoDetailMergedModel } from "./FavoriteVideoDetailMergedModel";

export class GetFavoriteVideoDetialResponseModel {

    private readonly _data: FavoriteVideoDetailMergedModel;

    constructor(favoriteVideoDetailMergedModel: FavoriteVideoDetailMergedModel) {

        this._data = favoriteVideoDetailMergedModel;
    }

    get data() {
        return this._data;
    }
}