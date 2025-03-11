import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";

export class FrontUserInfoCreateResponseModel {

    private readonly userName: string;

    constructor(userNameModel: FrontUserNameModel) {

        this.userName = userNameModel.frontUserName;
    }

}