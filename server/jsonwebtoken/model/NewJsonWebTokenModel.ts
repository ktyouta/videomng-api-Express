import { CookieOptions } from 'express';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { envConfig } from '../../util/const/EnvConfig';
import { IS_ENV_PRODUCTION } from '../../util/const/EnvProductionConst';


export class NewJsonWebTokenModel {

    private readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _token: string;
    // cookieオプション
    static readonly COOKIE_OPTION: CookieOptions = {
        httpOnly: true,
        secure: IS_ENV_PRODUCTION,
        sameSite: IS_ENV_PRODUCTION ? 'none' : 'lax',
    };

    constructor(frontUserIdModel: FrontUserIdModel) {

        const jwtSecretKey = envConfig.jwtKey;
        const accessTokenExpires = envConfig.accessTokenExpires;

        if (!jwtSecretKey) {
            throw Error(`設定ファイルにjwtの秘密鍵が設定されていません。`);
        }

        if (!accessTokenExpires) {
            throw Error(`設定ファイルにアクセストークンの有効期限が設定されていません。`);
        }

        const frontUserId = frontUserIdModel.frontUserId;

        if (!frontUserId) {
            throw Error(`jwtの作成にはユーザーIDが必要です。`);
        }

        const jwtStr = `${frontUserId}`;
        this._token = this.jwt.sign({ ID: jwtStr }, jwtSecretKey, { expiresIn: accessTokenExpires });
    }

    get token() {
        return this._token;
    }

}