import { FrontUserCheckAuthUserResponseDataType } from "../type/FrontUserCheckAuthUserType";
import { FrontUserInfoType } from "../type/FrontUserInfoType";

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