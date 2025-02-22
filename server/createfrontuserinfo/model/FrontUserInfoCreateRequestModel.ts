import { FrontUserBirthdayModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserInfoCreateRequestType } from "./FrontUserInfoCreateRequestType";

export class FrontUserInfoCreateRequestModel {

    private readonly _frontUserNameModel: FrontUserNameModel;
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;
    private readonly _frontUserBidthdayModel: FrontUserBirthdayModel;


    constructor(userInfoCreateBody: FrontUserInfoCreateRequestType) {

        this._frontUserNameModel = new FrontUserNameModel(userInfoCreateBody.userName);
        this._frontUserPasswordModel = FrontUserPasswordModel.hash(userInfoCreateBody.password);
        this._frontUserBidthdayModel = new FrontUserBirthdayModel(userInfoCreateBody.userBirthday);
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
}