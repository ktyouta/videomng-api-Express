import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { UpdateFavoriteVideoMemoRequestType } from "../Type/UpdateFavoriteVideoMemoRequestType";

export class UpdateFavoriteVideoMemoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // メモシーケンス
    private readonly _videoMemoSeqModel: VideoMemoSeqModel;
    // メモ
    private readonly _memoModel: VideoMemoModel;


    constructor(updateFavoriteVideoMemoRequestType: UpdateFavoriteVideoMemoRequestType,
        videoIdModel: VideoIdModel,
        videoMemoSeqModel: VideoMemoSeqModel
    ) {

        this._videoIdModel = videoIdModel;
        this._videoMemoSeqModel = videoMemoSeqModel;
        this._memoModel = new VideoMemoModel(updateFavoriteVideoMemoRequestType.memo);
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoMemoSeqModel() {
        return this._videoMemoSeqModel;
    }

    public get memoModel() {
        return this._memoModel;
    }
}