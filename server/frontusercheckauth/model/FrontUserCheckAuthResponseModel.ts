import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { FrontUserCheckAuthUserType } from "../type/FrontUserCheckAuthUserType";
import { AuthUserInfoType } from "../../common/type/AuthUserInfoType";

export class FrontUserCheckAuthResponseModel {

    private readonly _data: AuthUserInfoType;

    constructor(jsonWebTokenVerifyModel: JsonWebTokenUserModel) {

        const userInfo = jsonWebTokenVerifyModel.frontUserInfo;

        this._data = {
            userId: jsonWebTokenVerifyModel.frontUserId,
            userName: userInfo.userName,
            birthday: userInfo.birthday,
        };
    }

    get data() {
        return this._data;
    }
}