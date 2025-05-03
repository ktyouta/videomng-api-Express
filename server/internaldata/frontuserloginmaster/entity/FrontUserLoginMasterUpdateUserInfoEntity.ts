import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { FrontUserBirthdayModel } from "../../frontuserinfomaster/properties/FrontUserBirthdayModel";
import { FrontUserNameModel } from "../../frontuserinfomaster/properties/FrontUserNameModel";
import { FrontUserPasswordModel } from "../properties/FrontUserPasswordModel";


export class FrontUserLoginMasterUpdateUserInfoEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // ユーザー名
    private readonly _frontUserNameModel: FrontUserNameModel;

    constructor(userId: FrontUserIdModel,
        frontUserNameModel: FrontUserNameModel,
    ) {

        this._frontUserIdModel = userId;
        this._frontUserNameModel = frontUserNameModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserNameModel() {
        return this._frontUserNameModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }
}