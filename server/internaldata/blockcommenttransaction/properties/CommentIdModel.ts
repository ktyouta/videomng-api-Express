export class CommentIdModel {

    private readonly _commentId: string;

    constructor(commentId: string) {

        if (!commentId) {
            throw Error(`コメントIDが設定されていません。`);
        }

        this._commentId = commentId;
    }

    get commentId() {
        return this._commentId;
    }
}