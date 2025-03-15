import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { UpdateFavoriteVideoRequestType } from "./UpdateFavoriteVideoRequestType";

export class UpdateFavoriteVideoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;
    // コメント
    private readonly _videoMemoModel: VideoMemoModel[];

    constructor(videoIdModel: VideoIdModel,
        updateFavoriteVideoRequestType: UpdateFavoriteVideoRequestType) {

        const comments = updateFavoriteVideoRequestType.comments.map((e: string) => {
            return new VideoMemoModel(e);
        });

        this._videoIdModel = videoIdModel;
        this._videoMemoModel = comments;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get videoMemoModel() {
        return this._videoMemoModel;
    }
}