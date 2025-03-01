import { VideoIdModel } from "../../favoritevideotransaction/properties/VideoIdModel";
import { FrontUserIdModel } from "../../frontuserinfomaster/properties/FrontUserIdModel";
import { VideoCommentModel } from "../properties/VideoCommentModel";
import { VideoCommentSeqModel } from "../properties/VideoCommentSeqModel";


export class FavoriteVideoCommentTransactionUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // 行番号
    private readonly _videoCommentSeqModel: VideoCommentSeqModel;
    // コメント
    private readonly _videoCommentModel: VideoCommentModel;

    constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        videoCommentSeqModel: VideoCommentSeqModel,
        videoCommentModel: VideoCommentModel) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
        this._videoCommentSeqModel = videoCommentSeqModel;
        this._videoCommentModel = videoCommentModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoCommentSeqModel() {
        return this._videoCommentSeqModel;
    }

    public get videoCommentModel() {
        return this._videoCommentModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

    public get videoCommentSeq() {
        return this._videoCommentSeqModel.videoCommentSeq;
    }

    public get videoComment() {
        return this._videoCommentModel.videoComment;
    }
}