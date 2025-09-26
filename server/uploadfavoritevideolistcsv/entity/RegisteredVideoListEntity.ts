import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG } from "../../util/const/CommonConst";
import { VideoIdListModel } from "../model/VideoIdListModel";



export class RegisteredVideoListEntity {

    // 動画IDリスト
    private readonly _videoIdListModel: VideoIdListModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel, videoIdListModel: VideoIdListModel) {

        this._videoIdListModel = videoIdListModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    public get videoIdListModel() {
        return this._videoIdListModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get videoIdList() {
        return this.videoIdListModel.videoIdList;
    }

}