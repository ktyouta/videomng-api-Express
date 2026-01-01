import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";



export class FrontUserLoginSelectEntity {

    // ユーザーID
    private readonly _userNameModel: FrontUserNameModel;

    constructor(userNameModel: FrontUserNameModel,) {

        this._userNameModel = userNameModel;
    }

    public get userNameModel() {
        return this._userNameModel;
    }

    public get frontUserName() {
        return this._userNameModel.frontUserName;
    }

}