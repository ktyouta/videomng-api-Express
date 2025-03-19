import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";

export class DeleteFavoriteVideoMemoResponseModel {

    private readonly _data: FavoriteVideoMemoTransaction;

    constructor(FavoriteVideoMemo: FavoriteVideoMemoTransaction) {

        this._data = FavoriteVideoMemo;
    }

    get data() {
        return this._data;
    }
}