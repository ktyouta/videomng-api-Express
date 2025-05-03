import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { FrontUserInfoUpdateRequestModel } from "./FrontUserInfoUpdateRequestModel";

export class FrontUserInfoUpdateResponseModel {

    // ユーザー名
    private readonly userName: string;
    // ユーザーID
    private readonly userId: number;

    constructor(frontUserInfoUpdateRequestBody: FrontUserInfoUpdateRequestModel, userIdModel: FrontUserIdModel) {

        this.userName = frontUserInfoUpdateRequestBody.frontUserName;
        this.userId = userIdModel.frontUserId;
    }

}