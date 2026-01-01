import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";


export class DeleteFavoriteVideoFolderEntity {

    // フォルダ名
    private readonly _videoIdModel: VideoIdModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(
        videoIdModel: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
    ) {

        this._videoIdModel = videoIdModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get videoId() {
        return this._videoIdModel.videoId;
    }
}