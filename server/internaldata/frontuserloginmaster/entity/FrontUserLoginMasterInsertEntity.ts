import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../properties/FrontUserSaltValueModel";


export class FrontUserLoginMasterInsertEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;
    // ソルト値
    private readonly _frontUserSaltModel: FrontUserSaltValueModel;
    // ユーザー名
    private readonly _frontUserNameModel: FrontUserNameModel;

    constructor(userId: FrontUserIdModel,
        frontUserPasswordModel: FrontUserPasswordModel,
        salt: FrontUserSaltValueModel,
        frontUserNameModel: FrontUserNameModel,
    ) {

        this._frontUserIdModel = userId;
        this._frontUserPasswordModel = frontUserPasswordModel;
        this._frontUserSaltModel = salt;
        this._frontUserNameModel = frontUserNameModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserPasswordModel() {
        return this._frontUserPasswordModel;
    }

    public get frontUserSaltModel() {
        return this._frontUserSaltModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get frontUserPassword() {
        return this._frontUserPasswordModel.frontUserPassword;
    }

    public get salt() {
        return this._frontUserSaltModel.salt;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }
}