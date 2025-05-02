import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserLoginResponseUserModel } from "./FrontUserLoginResponseUserModel";

export class FrontUserLoginCreateResponseModel {

    private readonly _data: FrontUserInfoMaster;

    constructor(frontUserInfoMaster: FrontUserInfoMaster) {

        this._data = frontUserInfoMaster;
    }

    get data() {
        return this._data;
    }
}