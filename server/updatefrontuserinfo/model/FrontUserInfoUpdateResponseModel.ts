import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { AuthUserInfoType } from "../../types/AuthUserInfoType";
import { FrontUserInfoUpdateRequestModel } from "./FrontUserInfoUpdateRequestModel";

export class FrontUserInfoUpdateResponseModel {


    // フロントユーザー情報
    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoUpdateRequestBody: FrontUserInfoUpdateRequestModel,
        userIdModel: FrontUserIdModel,
        accessTokenModel: AccessTokenModel
    ) {

        this._data = {
            accessToken: accessTokenModel.token,
            userInfo: {
                userId: userIdModel.frontUserId,
                userName: frontUserInfoUpdateRequestBody.frontUserName,
                birthday: frontUserInfoUpdateRequestBody.frontUserBirthDay,
            }
        }
    }

    get data() {
        return this._data;
    }
}