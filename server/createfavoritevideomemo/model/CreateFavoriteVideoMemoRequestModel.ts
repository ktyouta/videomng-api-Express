import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CreateFavoriteVideoMemoRequestType } from "../Type/CreateFavoriteVideoMemoRequestType";

export class CreateFavoriteVideoMemoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // メモ
    private readonly _memoModel: VideoMemoModel;

    constructor(createFavoriteVideoMemoRequestType: CreateFavoriteVideoMemoRequestType,
        videoIdModel: VideoIdModel
    ) {

        this._videoIdModel = videoIdModel;
        this._memoModel = new VideoMemoModel(createFavoriteVideoMemoRequestType.memo);
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get memoModel() {
        return this._memoModel;
    }
}