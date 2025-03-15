import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";



export class GetFavoriteVideoMemoSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 動画ID
    private readonly _videoIdModel: VideoIdModel;

    constructor(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
    ) {

        this._frontUserIdModel = frontUserIdModel;
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