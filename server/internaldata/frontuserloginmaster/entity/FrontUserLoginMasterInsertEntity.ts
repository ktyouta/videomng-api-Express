import { FrontUserIdModel } from "../../frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../properties/FrontUserPasswordModel";


export class FrontUserLoginMasterInsertEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // パスワード
    private readonly _frontUserPasswordModel: FrontUserPasswordModel;


    constructor(userId: FrontUserIdModel,
        frontUserPasswordModel: FrontUserPasswordModel,
    ) {

        this._frontUserIdModel = userId;
        this._frontUserPasswordModel = frontUserPasswordModel;
    }

    public get frontUserIdModel() {
        return this._frontUserIdModel;
    }

    public get frontUserPasswordModel() {
        return this._frontUserPasswordModel;
    }

    public get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    public get frontUserPassword() {
        return this._frontUserPasswordModel.frontUserPassword;
    }

}