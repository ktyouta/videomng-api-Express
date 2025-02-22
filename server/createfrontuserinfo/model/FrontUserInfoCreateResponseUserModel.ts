import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";

export class FrontUserInfoCreateResponseUserModel {

    private readonly userName: string;

    constructor(userNameModel: FrontUserNameModel) {

        this.userName = userNameModel.frontUserName;
    }

}