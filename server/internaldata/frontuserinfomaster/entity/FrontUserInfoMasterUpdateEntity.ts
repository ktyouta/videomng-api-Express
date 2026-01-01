import { FrontUserIdModel } from "../../common/properties/FrontUserIdModel";
import { FrontUserBirthdayModel } from "../properties/FrontUserBirthdayModel";
import { FrontUserNameModel } from "../properties/FrontUserNameModel";


export class FrontUserInfoMasterUpdateEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // ユーザー名
    private readonly _frontUserNameModel: FrontUserNameModel;
    // ユーザー生年月日
    private readonly _frontUserBirthDayModel: FrontUserBirthdayModel;


    constructor(userId: FrontUserIdModel,
        userName: FrontUserNameModel,
        userBirthDay: FrontUserBirthdayModel,
    ) {

        this._frontUserIdModel = userId;
        this._frontUserNameModel = userName;
        this._frontUserBirthDayModel = userBirthDay;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserNameModel() {
        return this._frontUserNameModel;
    }

    public get frontUserBirthDayModel() {
        return this._frontUserBirthDayModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }

    public get frontUserBirthDay() {
        return this._frontUserBirthDayModel.frontUserBirthDay;
    }

}