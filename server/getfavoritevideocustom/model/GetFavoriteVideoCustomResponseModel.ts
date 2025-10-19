import { FavoriteVideoTransaction } from "@prisma/client";
import { FavoriteVideoCustomMergedModel } from "./FavoriteVideoCustomMergedModel";

export class GetFavoriteVideoCustomResponseModel {

    private readonly _data: FavoriteVideoCustomMergedModel;

    constructor(favoriteVideoCustomMergedModel: FavoriteVideoCustomMergedModel) {

        this._data = favoriteVideoCustomMergedModel;
    }

    get data() {
        return this._data;
    }
}