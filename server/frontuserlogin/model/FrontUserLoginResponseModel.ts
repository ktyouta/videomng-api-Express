import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserLoginCreateResponseUserModel } from "./FrontUserLoginResponseUserModel";

export class FrontUserLoginCreateResponseModel {

    private readonly userInfo: FrontUserLoginCreateResponseUserModel;
    private readonly token: string;

    constructor(userNameModel: FrontUserNameModel, newJsonWebTokenModel: NewJsonWebTokenModel) {

        this.userInfo = new FrontUserLoginCreateResponseUserModel(userNameModel);
        this.token = newJsonWebTokenModel.token;
    }

}