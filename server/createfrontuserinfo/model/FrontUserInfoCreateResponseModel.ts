import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserInfoCreateResponseUserModel } from "./FrontUserInfoCreateResponseUserModel";

export class FrontUserInfoCreateResponseModel {

    private readonly userInfo: FrontUserInfoCreateResponseUserModel;
    private readonly token: string;

    constructor(userNameModel: FrontUserNameModel, newJsonWebTokenModel: NewJsonWebTokenModel) {

        this.userInfo = new FrontUserInfoCreateResponseUserModel(userNameModel);
        this.token = newJsonWebTokenModel.token;
    }

}