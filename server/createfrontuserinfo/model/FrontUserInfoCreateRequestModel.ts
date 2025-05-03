import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";
import { FrontUserInfoCreateRequestType } from "./FrontUserInfoCreateRequestType";

export class FrontUserInfoCreateRequestModel {

    private readonly _frontUserNameModel: FrontUserNameModel;
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;
    private readonly _frontUserBidthdayModel: FrontUserBirthdayModel;
    private readonly _frontUserSaltModel: FrontUserSaltValueModel;


    constructor(userInfoCreateBody: FrontUserInfoCreateRequestType) {

        // ソルト値生成
        const salt = FrontUserSaltValueModel.generate();

        this._frontUserNameModel = new FrontUserNameModel(userInfoCreateBody.userName);
        this._frontUserPasswordModel = FrontUserPasswordModel.hash(userInfoCreateBody.password, salt);
        this._frontUserBidthdayModel = new FrontUserBirthdayModel(userInfoCreateBody.userBirthday);
        this._frontUserSaltModel = salt;
    }


    public get frontUserNameModel() {
        return this._frontUserNameModel;
    }

    public get frontUserPasswordModel() {
        return this._frontUserPasswordModel;
    }

    public get frontUserBirthdayModel() {
        return this._frontUserBidthdayModel;
    }

    public get frontUserSaltModel() {
        return this._frontUserSaltModel;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }

    public get frontUserBirthDay() {
        return this._frontUserBidthdayModel.frontUserBirthDay;
    }
}