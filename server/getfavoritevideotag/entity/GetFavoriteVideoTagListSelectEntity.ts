import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";


export class GetFavoriteVideoTagListSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;


    constructor(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,) {

        this._frontUserIdModel = frontUserIdModel;
        this._videoIdModel = videoIdModel;
    }

    get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get videoIdModel() {
        return this._videoIdModel;
    }

    get videoId() {
        return this._videoIdModel.videoId;
    }
}