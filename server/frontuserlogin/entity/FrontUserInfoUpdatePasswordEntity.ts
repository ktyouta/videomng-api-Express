import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";



export class FrontUserInfoUpdatePasswordEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _passwordModel: FrontUserPasswordModel

    constructor(frontUserIdModel: FrontUserIdModel,
        passwordModel: FrontUserPasswordModel,
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._passwordModel = passwordModel;
    }

    get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get password() {
        return this._passwordModel.frontUserPassword;
    }
}