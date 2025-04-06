import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { CommentIdModel } from "../../common/properties/CommentIdModel";
import { VideoIdModel } from "../../common/properties/VideoIdModel";


export class FavoriteCommentTransactionInsertEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // コメントID
    private readonly _commentIdModel: CommentIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;


    constructor(userId: FrontUserIdModel,
        commentIdModel: CommentIdModel,
        videoIdModel: VideoIdModel,) {

        this._frontUserIdModel = userId;
        this._commentIdModel = commentIdModel;
        this._videoIdModel = videoIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get commentIdModel() {
        return this._commentIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get commentId() {
        return this._commentIdModel.commentId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }
}