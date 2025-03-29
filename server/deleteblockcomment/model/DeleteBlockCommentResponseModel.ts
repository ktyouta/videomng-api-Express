import { BlockCommentTransaction, FavoriteVideoTransaction } from "@prisma/client";

export class DeleteBlockCommentResponseModel {

    private readonly _data: BlockCommentTransaction;

    constructor(BlockComment: BlockCommentTransaction) {

        this._data = BlockComment;
    }

    get data() {
        return this._data;
    }
}