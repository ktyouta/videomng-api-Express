import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserLoginResponseUserModel } from "./FrontUserLoginResponseUserModel";
import { AuthUserInfoType } from "../../common/type/AuthUserInfoType";

export class FrontUserLoginCreateResponseModel {

    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoMaster: FrontUserInfoMaster) {

        this._data = {
            userId: frontUserInfoMaster.userId,
            userName: frontUserInfoMaster.userName,
            birthday: frontUserInfoMaster.userBirthday,
        };
    }

    get data() {
        return this._data;
    }
}