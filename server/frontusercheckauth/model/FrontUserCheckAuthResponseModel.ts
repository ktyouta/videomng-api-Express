import { FrontUserInfoType } from "../../common/type/FrontUserInfoType";
import { FrontUserCheckAuthUserResponseDataType } from "../type/FrontUserCheckAuthUserType";

export class FrontUserCheckAuthResponseModel {

    private readonly _data: FrontUserCheckAuthUserResponseDataType;

    constructor(userInfo: FrontUserInfoType) {

        this._data = {
            userInfo: {
                userId: userInfo.userId,
                userName: userInfo.userName,
                birthday: userInfo.birthday,
            }
        };
    }

    get data() {
        return this._data;
    }
}