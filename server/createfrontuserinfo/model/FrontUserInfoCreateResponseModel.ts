import { AuthUserInfoType } from "../../common/type/AuthUserInfoType";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserInfoCreateRequestModel } from "./FrontUserInfoCreateRequestModel";

export class FrontUserInfoCreateResponseModel {

    // フロントユーザー情報
    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoCreateRequestBody: FrontUserInfoCreateRequestModel, userIdModel: FrontUserIdModel) {

        this._data = {
            userId: userIdModel.frontUserId,
            userName: frontUserInfoCreateRequestBody.frontUserName,
            birthday: frontUserInfoCreateRequestBody.frontUserBirthDay,
        }
    }

    get data() {
        return this._data;
    }
}