import { FavoriteVideoTagTransaction } from "@prisma/client";
import { UpdateFavoriteVideoTagResponseDataType } from "../type/UpdateFavoriteVideoTagResponseDataType";

export class UpdateFavoriteVideoTagResponseModel {

    private readonly _data: UpdateFavoriteVideoTagResponseDataType[];

    constructor(tagList: UpdateFavoriteVideoTagResponseDataType[]) {

        this._data = tagList;
    }

    get data() {
        return this._data;
    }
}