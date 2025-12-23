import { CookieModel } from "../../cookie/model/CookieModel";


export class JsonWebTokenModel {

    // トークン
    private readonly _token: string;
    // cookieのキー
    static readonly KEY: string = `access_token`;

    constructor(cookieModel: CookieModel) {

        this._token = cookieModel.cookie[JsonWebTokenModel.KEY];
    }

    get token() {
        return this._token;
    }
}