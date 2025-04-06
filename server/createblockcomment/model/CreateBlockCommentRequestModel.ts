import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CreateBlockCommentRequestType } from "./CreateBlockCommentRequestType";

export class CreateBlockCommentRequestModel {

    // コメントID
    private readonly _commentIdModel: CommentIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;

    constructor(createBlockCommentRequestType: CreateBlockCommentRequestType) {

        this._commentIdModel = new CommentIdModel(createBlockCommentRequestType.commentId);
        this._videoIdModel = new VideoIdModel(createBlockCommentRequestType.videoId);
    }

    get commentIdModel() {
        return this._commentIdModel;
    }

    get videoIdModel() {
        return this._videoIdModel;
    }
}