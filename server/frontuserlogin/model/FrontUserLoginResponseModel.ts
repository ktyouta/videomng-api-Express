import { FrontUserInfoMaster } from "@prisma/client";
import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { AuthUserInfoType } from "../../types/AuthUserInfoType";

export class FrontUserLoginCreateResponseModel {

    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoMaster: FrontUserInfoMaster,
        accessTokenModel: AccessTokenModel,
    ) {

        this._data = {
            accessToken: accessTokenModel.token,
            userInfo: {
                userId: frontUserInfoMaster.userId,
                userName: frontUserInfoMaster.userName,
                birthday: frontUserInfoMaster.userBirthday,
            }
        };
    }

    get data() {
        return this._data;
    }
}