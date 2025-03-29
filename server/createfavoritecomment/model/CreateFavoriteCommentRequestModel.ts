import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { CreateFavoriteCommentRequestType } from "./CreateFavoriteCommentRequestType";

export class CreateFavoriteCommentRequestModel {

    // コメントID
    private readonly _commentIdModel: CommentIdModel;

    constructor(createFavoriteCommentRequestType: CreateFavoriteCommentRequestType) {

        this._commentIdModel = new CommentIdModel(createFavoriteCommentRequestType.commentId);
    }

    public get commentIdModel() {
        return this._commentIdModel;
    }

}