import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";

export class FrontUserLoginCreateResponseUserModel {

    private readonly userName: string;

    constructor(userNameModel: FrontUserNameModel) {

        this.userName = userNameModel.frontUserName;
    }

}