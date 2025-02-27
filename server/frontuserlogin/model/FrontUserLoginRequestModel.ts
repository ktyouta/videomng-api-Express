import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserLoginRequestType } from "./FrontUserLoginRequestType";

export class FrontUserLoginRequestModel {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;


    constructor(frontUserLoginRequestType: FrontUserLoginRequestType) {

        this._frontUserIdModel = FrontUserIdModel.reConstruct(frontUserLoginRequestType.userId);
        this._frontUserPasswordModel = FrontUserPasswordModel.hash(frontUserLoginRequestType.password);
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