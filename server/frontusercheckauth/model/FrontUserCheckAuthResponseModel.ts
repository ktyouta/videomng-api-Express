import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { AuthUserInfoType } from "../../common/type/AuthUserInfoType";
import { FrontUserInfoType } from "../../common/type/FrontUserInfoType";

export class FrontUserCheckAuthResponseModel {

    private readonly _data: AuthUserInfoType;

    constructor(userInfo: FrontUserInfoType,
        accessTokenModel: AccessTokenModel
    ) {

        this._data = {
            accessToken: accessTokenModel.token,
            userInfo: {
                userId: userInfo.userId,
                userName: userInfo.userName,
                birthday: userInfo.birthday,
            }
        };
    }

    get data() {
        return this._data;
    }
}