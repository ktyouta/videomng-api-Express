import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../properties/FrontUserSaltValueModel";


export class FrontUserLoginMasterUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;
    // ソルト値
    private readonly _frontUserSaltValueModel: FrontUserSaltValueModel;

    constructor(userId: FrontUserIdModel,
        frontUserPasswordModel: FrontUserPasswordModel,
        frontUserSaltValueModel: FrontUserSaltValueModel,
    ) {

        this._frontUserIdModel = userId;
        this._frontUserPasswordModel = frontUserPasswordModel;
        this._frontUserSaltValueModel = frontUserSaltValueModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserPasswordModel() {
        return this._frontUserPasswordModel;
    }

    public get frontUserSaltValueModel() {
        return this._frontUserSaltValueModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get frontUserPassword() {
        return this._frontUserPasswordModel.frontUserPassword;
    }

    public get salt() {
        return this._frontUserSaltValueModel.salt;
    }
}