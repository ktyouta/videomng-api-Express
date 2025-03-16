import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { DeleteFavoriteVideoMemoRequestType } from "../Type/DeleteFavoriteVideoMemoRequestType";

export class DeleteFavoriteVideoMemoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // メモ
    private readonly _videoMemoSeqModel: VideoMemoSeqModel;

    constructor(deleteFavoriteVideoMemoRequestType: DeleteFavoriteVideoMemoRequestType) {

        this._videoIdModel = new VideoIdModel(deleteFavoriteVideoMemoRequestType.videoId);
        this._videoMemoSeqModel = new VideoMemoSeqModel(deleteFavoriteVideoMemoRequestType.videoMemoSeq);
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoMemoSeqModel() {
        return this._videoMemoSeqModel;
    }
}