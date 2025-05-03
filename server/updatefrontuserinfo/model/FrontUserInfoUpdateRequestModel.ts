import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";
import { FrontUserInfoUpdateRequestType } from "./FrontUserInfoUpdateRequestType";

export class FrontUserInfoUpdateRequestModel {

    private readonly _frontUserNameModel: FrontUserNameModel;
    private readonly _frontUserBidthdayModel: FrontUserBirthdayModel;


    constructor(userInfoUpdateBody: FrontUserInfoUpdateRequestType) {

        this._frontUserNameModel = new FrontUserNameModel(userInfoUpdateBody.userName);
        this._frontUserBidthdayModel = new FrontUserBirthdayModel(userInfoUpdateBody.userBirthday);
    }


    public get frontUserNameModel() {
        return this._frontUserNameModel;
    }

    public get frontUserBirthdayModel() {
        return this._frontUserBidthdayModel;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }

    public get frontUserBirthDay() {
        return this._frontUserBidthdayModel.frontUserBirthDay;
    }
}