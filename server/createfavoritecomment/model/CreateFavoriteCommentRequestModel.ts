import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CreateFavoriteCommentRequestType } from "./CreateFavoriteCommentRequestType";

export class CreateFavoriteCommentRequestModel {

    // コメントID
    private readonly _commentIdModel: CommentIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;

    constructor(createFavoriteCommentRequestType: CreateFavoriteCommentRequestType,
        videoIdModel: VideoIdModel
    ) {

        this._commentIdModel = new CommentIdModel(createFavoriteCommentRequestType.commentId);
        this._videoIdModel = videoIdModel;
    }

    get commentIdModel() {
        return this._commentIdModel;
    }

    get videoIdModel() {
        return this._videoIdModel;
    }
}