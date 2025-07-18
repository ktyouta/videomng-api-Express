import { CommentIdModel } from "../../common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";


export class BlockCommentTransactionUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // コメントID
    private readonly _commentIdModel: CommentIdModel;


    constructor(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
    ) {

        this._frontUserIdModel = userId;
        this._commentIdModel = commentIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._commentIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get commentId() {
        return this._commentIdModel.commentId;
    }

}