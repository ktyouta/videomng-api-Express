import { FavoriteVideoCategoryTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { UpdateFavoriteVideoResponseDataType } from "../type/UpdateFavoriteVideoResponseDataType";

export class UpdateFavoriteVideoResponseModel {

    private readonly _data: UpdateFavoriteVideoResponseDataType;

    constructor(detail: FavoriteVideoTransaction,
        category: FavoriteVideoCategoryTransaction[]) {

        this._data = {
            detail,
            category
        }
    }

    get data() {
        return this._data;
    }
}