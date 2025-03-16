import { VideoIdModel } from "../../favoritevideotransaction/properties/VideoIdModel";
import { FrontUserIdModel } from "../../frontuserinfomaster/properties/FrontUserIdModel";
import { VideoMemoModel } from "../properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../properties/VideoMemoSeqModel";


export class FavoriteVideoMemoTransactionSoftDeleteEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // 行番号
    private readonly _videoMemoSeqModel: VideoMemoSeqModel;

    constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        videoMemoSeqModel: VideoMemoSeqModel,) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
        this._videoMemoSeqModel = videoMemoSeqModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoMemoSeqModel() {
        return this._videoMemoSeqModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

    public get videoMemoSeq() {
        return this._videoMemoSeqModel.videoMemoSeq;
    }
}