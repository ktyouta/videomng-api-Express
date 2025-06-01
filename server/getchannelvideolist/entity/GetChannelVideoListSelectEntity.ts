import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";



export class GetChannelVideoListSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel,) {

        this._frontUserIdModel = frontUserIdModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }
}