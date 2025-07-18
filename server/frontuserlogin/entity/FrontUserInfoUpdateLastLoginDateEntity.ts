import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FLG } from "../../util/const/CommonConst";



export class FrontUserInfoUpdateLastLoginDateEntity {

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