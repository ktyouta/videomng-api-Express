import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CreateFavoriteVideoRequestType } from "./CreateFavoriteVideoRequestType";

export class CreateFavoriteVideoRequestModel {

    // 動画ID
    private readonly _videoIdModel: VideoIdModel;

    constructor(createFavoriteVideoRequestType: CreateFavoriteVideoRequestType) {

        this._videoIdModel = new VideoIdModel(createFavoriteVideoRequestType.videoId);
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

}