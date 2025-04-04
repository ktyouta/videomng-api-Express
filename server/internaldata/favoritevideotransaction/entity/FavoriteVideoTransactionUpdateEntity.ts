import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../common/properties/VideoIdModel";


export class FavoriteVideoTransactionUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;


    constructor(userId: FrontUserIdModel,
        videoIdModel: VideoIdModel,
    ) {

        this._frontUserIdModel = userId;
        this._videoIdModel = videoIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get videoIdModel() {
        return this._videoIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoId() {
        return this._videoIdModel.videoId;
    }

}