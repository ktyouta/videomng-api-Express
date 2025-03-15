import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { CreateFavoriteVideoMemoRequestType } from "./CreateFavoriteVideoMemoRequestType";

export class CreateFavoriteVideoMemoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // メモ
    private readonly _memoModel: VideoMemoModel;

    constructor(createFavoriteVideoMemoRequestType: CreateFavoriteVideoMemoRequestType) {

        this._videoIdModel = new VideoIdModel(createFavoriteVideoMemoRequestType.videoId);
        this._memoModel = new VideoMemoModel(createFavoriteVideoMemoRequestType.memo);
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get memoModel() {
        return this._memoModel;
    }
}