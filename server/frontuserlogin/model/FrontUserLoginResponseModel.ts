import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserLoginResponseUserModel } from "./FrontUserLoginResponseUserModel";

export class FrontUserLoginCreateResponseModel {

    private readonly userInfo: FrontUserLoginResponseUserModel;
    private readonly token: string;

    constructor(frontUserInfoMaster: FrontUserInfoMaster, newJsonWebTokenModel: NewJsonWebTokenModel) {

        this.userInfo = new FrontUserLoginResponseUserModel(frontUserInfoMaster);
        this.token = newJsonWebTokenModel.token;
    }

}