import { CookieModel } from "../../cookie/model/CookieModel";
import ENV from "../../env.json";


export class JsonWebTokenModel {

    // トークン
    private readonly _token: string;
    // cookieのキー
    static readonly KEY: string = ENV.COOKIE_KEY_JWT;

    constructor(cookieModel: CookieModel) {

        if (!JsonWebTokenModel.KEY) {
            throw Error(`設定ファイルにcookie(jwt)のキーが設定されていません。`);
        }

        this._token = cookieModel.cookie[JsonWebTokenModel.KEY];
    }

    get token() {
        return this._token;
    }
}