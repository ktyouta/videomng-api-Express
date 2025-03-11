import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserLoginResponseUserModel } from "./FrontUserLoginResponseUserModel";

export class FrontUserLoginCreateResponseModel {

    private readonly userName: string;

    constructor(frontUserInfoMaster: FrontUserInfoMaster) {

        this.userName = frontUserInfoMaster.userName;
    }

}