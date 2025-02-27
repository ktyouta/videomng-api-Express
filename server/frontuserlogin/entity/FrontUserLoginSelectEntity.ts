import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FLG } from "../../util/const/CommonConst";



export class FrontUserLoginSelectEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;

    constructor(frontUserIdModel: FrontUserIdModel,
        frontUserPasswordModel: FrontUserPasswordModel
    ) {

        this._frontUserIdModel = frontUserIdModel;
        this._frontUserPasswordModel = frontUserPasswordModel
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get frontUserPasswordModel() {
        return this._frontUserPasswordModel;
    }

    public get frontUserPassword() {
        return this._frontUserPasswordModel.frontUserPassword;
    }

}