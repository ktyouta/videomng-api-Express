import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { CreateBlockCommentRequestType } from "./CreateBlockCommentRequestType";

export class CreateBlockCommentRequestModel {

    // コメントID
    private readonly _commentIdModel: CommentIdModel;

    constructor(createBlockCommentRequestType: CreateBlockCommentRequestType) {

        this._commentIdModel = new CommentIdModel(createBlockCommentRequestType.commentId);
    }

    public get commentIdModel() {
        return this._commentIdModel;
    }

}