import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FLG } from "../../util/const/CommonConst";



export class FrontUserLoginSelectEntity {

    // ユーザーID
    private readonly _userNameModel: FrontUserNameModel;

    constructor(userNameModel: FrontUserNameModel,) {

        this._userNameModel = userNameModel;
    }

    public get userNameModel() {
        return this._userNameModel;
    }

    public get frontUserName() {
        return this._userNameModel.frontUserName;
    }

}