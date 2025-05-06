import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";



export class FrontUserInfoUpdateSelectEntity {

    // ユーザー名
    private readonly _frontUserNameModel: FrontUserNameModel;
    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;

    constructor(frontUserIdModel: FrontUserIdModel, userNameModel: FrontUserNameModel) {

        this._frontUserNameModel = userNameModel;
        this._frontUserIdModel = frontUserIdModel;
    }

    public get frontUserNameModel() {
        return this._frontUserNameModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }
}