import { FavoriteCommentTransaction, FavoriteVideoTransaction } from "@prisma/client";

export class DeleteFavoriteCommentResponseModel {

    private readonly _data: FavoriteCommentTransaction;

    constructor(FavoriteComment: FavoriteCommentTransaction) {

        this._data = FavoriteComment;
    }

    get data() {
        return this._data;
    }
}