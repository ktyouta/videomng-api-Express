import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { FrontUserCheckAuthUserType } from "../type/FrontUserCheckAuthUserType";

export class FrontUserCheckAuthResponseModel {

    private readonly _data: FrontUserCheckAuthUserType;

    constructor(jsonWebTokenVerifyModel: JsonWebTokenUserModel) {

        this._data = {
            userId: jsonWebTokenVerifyModel.frontUserId,
            userName: jsonWebTokenVerifyModel.frontUserName
        };
    }

    get data() {
        return this._data;
    }
}