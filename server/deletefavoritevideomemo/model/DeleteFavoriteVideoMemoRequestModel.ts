import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { DeleteFavoriteVideoMemoRequestType } from "../Type/DeleteFavoriteVideoMemoRequestType";

export class DeleteFavoriteVideoMemoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // メモ
    private readonly _videoMemoSeqModel: VideoMemoSeqModel;

    constructor(videoIdModel: VideoIdModel,
        videoMemoSeqModel: VideoMemoSeqModel
    ) {

        this._videoIdModel = videoIdModel;
        this._videoMemoSeqModel = videoMemoSeqModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoMemoSeqModel() {
        return this._videoMemoSeqModel;
    }
}