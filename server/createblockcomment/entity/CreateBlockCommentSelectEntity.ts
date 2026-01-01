import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";



export class CreateBlockCommentSelectEntity {

    // コメントID
    private readonly _commentIdModel: CommentIdModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel, commentIdModel: CommentIdModel) {

        this._commentIdModel = commentIdModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    public get commentIdModel() {
        return this._commentIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get commentId() {
        return this._commentIdModel.commentId;
    }

}