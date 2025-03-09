import { FrontUserInfoMaster } from "@prisma/client";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";

export class FrontUserLoginResponseUserModel {

    private readonly userName: string;

    constructor(frontUserInfoMaster: FrontUserInfoMaster) {

        this.userName = frontUserInfoMaster.userName;
    }

}