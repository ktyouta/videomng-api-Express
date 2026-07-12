import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { AuthUserInfoType } from "../../types/AuthUserInfoType";
import { FrontUserInfoCreateRequestModel } from "./FrontUserInfoCreateRequestModel";

export class FrontUserInfoCreateResponseModel {

    // フロントユーザー情報
    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoCreateRequestBody: FrontUserInfoCreateRequestModel,
        userIdModel: FrontUserIdModel,
        accessTokenModel: AccessTokenModel) {

        this._data = {
            accessToken: accessTokenModel.token,
            userInfo: {
                userId: userIdModel.frontUserId,
                userName: frontUserInfoCreateRequestBody.frontUserName,
                birthday: frontUserInfoCreateRequestBody.frontUserBirthDay,
            }
        }
    }

    get data() {
        return this._data;
    }
}