import { CookieOptions } from 'express';
import ENV from '../../env.json';
import { FrontUserIdModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserIdModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { envConfig } from '../../util/const/EnvConfig';


export class NewJsonWebTokenModel {

    private readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _token: string;
    // cookieオプション
    static readonly COOKIE_OPTION: CookieOptions = {
        httpOnly: true,
    };
    // cookieのキー
    static readonly COOKIE_KEY: string = ENV.COOKIE_KEY;

    constructor(frontUserIdModel: FrontUserIdModel, frontUserPasswordModel: FrontUserPasswordModel) {

        const jwtSecretKey = envConfig.jwtKey;

        if (!jwtSecretKey) {
            throw Error(`設定ファイルにjwtの秘密鍵が設定されていません。`);
        }

        if (!NewJsonWebTokenModel.COOKIE_KEY) {
            throw Error(`設定ファイルにcookieのキーが設定されていません。`);
        }

        const frontUserId = frontUserIdModel.frontUserId;

        if (!frontUserId) {
            throw Error(`jwtの作成にはユーザーIDが必要です。`);
        }

        const frontUserPassword = frontUserPasswordModel.frontUserPassword;

        if (!frontUserPassword) {
            throw Error(`jwtの作成にはパスワードが必要です。`);
        }

        const jwtStr = `${frontUserId},${frontUserPassword}`;
        this._token = this.jwt.sign({ ID: jwtStr }, jwtSecretKey);
    }

    get token() {
        return this._token;
    }

}