import { FavoriteVideoCategoryTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { UpdateFavoriteVideoCustomResponseDataType } from "../type/UpdateFavoriteVideoCustomResponseDataType";

export class UpdateFavoriteVideoCustomResponseModel {

    private readonly _data: UpdateFavoriteVideoCustomResponseDataType;

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