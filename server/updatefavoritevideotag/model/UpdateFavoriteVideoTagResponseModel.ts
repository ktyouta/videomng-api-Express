import { FavoriteVideoTagTransaction } from "@prisma/client";
import { FavoriteVideoTagType } from "../type/UpdateFavoriteVideoTagResponseDataType";

export class UpdateFavoriteVideoTagResponseModel {

    private readonly _data: FavoriteVideoTagType[];

    constructor(tagList: FavoriteVideoTagType[]) {

        this._data = tagList;
    }

    get data() {
        return this._data;
    }
}