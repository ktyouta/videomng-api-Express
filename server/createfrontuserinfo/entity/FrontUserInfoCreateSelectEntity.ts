import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";



export class FrontUserInfoCreateSelectEntity {

    // ユーザー名
    private readonly _frontUserNameModel: FrontUserNameModel;

    constructor(userName: FrontUserNameModel) {

        this._frontUserNameModel = userName;
    }

    public get frontUserNameModel() {
        return this._frontUserNameModel;
    }

    public get frontUserName() {
        return this._frontUserNameModel.frontUserName;
    }

}