import { AuthUserInfoType } from "../../common/type/AuthUserInfoType";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserInfoUpdateRequestModel } from "./FrontUserInfoUpdateRequestModel";

export class FrontUserInfoUpdateResponseModel {


    // フロントユーザー情報
    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoUpdateRequestBody: FrontUserInfoUpdateRequestModel, userIdModel: FrontUserIdModel) {

        this._data = {
            userId: userIdModel.frontUserId,
            userName: frontUserInfoUpdateRequestBody.frontUserName,
            birthday: frontUserInfoUpdateRequestBody.frontUserBirthDay,
        }
    }

    get data() {
        return this._data;
    }
}