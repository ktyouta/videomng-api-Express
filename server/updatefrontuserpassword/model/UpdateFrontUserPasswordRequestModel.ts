import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";
import { UpdateFrontUserPasswordRequestType } from "./UpdateFrontUserPasswordRequestType";

export class UpdateFrontUserPasswordRequestModel {

    // 現在のパスワード
    private readonly _currentPassword: FrontUserPasswordModel;
    // 新しいパスワード
    private readonly _newPasswordModel: FrontUserPasswordModel;
    // パスワード(確認用)
    private readonly _confirmPasswordModel: FrontUserPasswordModel;
    // ソルト値
    private readonly _frontUserSaltValueModel: FrontUserSaltValueModel;


    constructor(userPasswordUpdateBody: UpdateFrontUserPasswordRequestType) {

        // ソルト値生成
        const salt = FrontUserSaltValueModel.generate();

        this._currentPassword = FrontUserPasswordModel.reConstruct(userPasswordUpdateBody.currentPassword);
        this._newPasswordModel = FrontUserPasswordModel.hash(userPasswordUpdateBody.newPassword, salt);
        this._confirmPasswordModel = FrontUserPasswordModel.hash(userPasswordUpdateBody.confirmPassword, salt);
        this._frontUserSaltValueModel = salt;
    }

    get currentPassword() {
        return this._currentPassword;
    }

    get newPasswordModel() {
        return this._newPasswordModel;
    }

    get confirmPasswordModel() {
        return this._confirmPasswordModel;
    }

    get frontUserSaltValueModel() {
        return this._frontUserSaltValueModel;
    }
}