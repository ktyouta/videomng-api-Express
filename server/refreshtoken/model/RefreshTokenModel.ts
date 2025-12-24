import { CookieOptions } from 'express';
import { CookieModel } from '../../cookie/model/CookieModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { envConfig } from '../../util/const/EnvConfig';
import { IS_ENV_PRODUCTION } from '../../util/const/EnvProductionConst';


export class RefreshTokenModel {

    private readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _token: string;
    // cookieのキー
    static readonly COOKIE_KEY: string = `refresh_token`;
    // cookieオプション
    static readonly COOKIE_OPTION: CookieOptions = {
        httpOnly: true,
        secure: IS_ENV_PRODUCTION,
        sameSite: IS_ENV_PRODUCTION ? 'none' : 'lax',
    };
    // リフレッシュトークン用のjwtキー
    private static readonly JWT_KEY = envConfig.jwtRefreshKey;
    // リフレッシュトークン有効期間
    private static readonly REFRESH_TOKEN_EXPIRES = envConfig.refreshTokenExpires;

    private constructor(token: string) {
        this._token = token;
    }

    /**
     * トークンを取得
     * @param cookieModel 
     * @returns 
     */
    async get(cookieModel: CookieModel) {

        const token = cookieModel.cookie[RefreshTokenModel.COOKIE_KEY];

        if (!token) {
            throw Error(`トークンが存在しません。`);
        }

        const jwtRefreshKey = envConfig.jwtRefreshKey;

        if (!jwtRefreshKey) {
            throw Error(`設定ファイルにjwtの秘密鍵が設定されていません。`);
        }

        try {

            const decoded = this.jwt.verify(token, RefreshTokenModel.JWT_KEY);

            if (!decoded || typeof decoded !== `object`) {
                throw Error(`jwtから認証情報の取得に失敗しました。`);
            }

            const id: string = decoded.sub;

            if (!id) {
                throw Error(`jwtの認証情報が不正です。`);
            }

            return new RefreshTokenModel(token);
        } catch (err) {
            throw Error(`jwt認証中にエラーが発生しました。ERROR:${err}`);
        }
    }

    /**
     * トークンの発行
     * @param frontUserIdModel 
     * @returns 
     */
    create(frontUserIdModel: FrontUserIdModel) {

        if (!RefreshTokenModel.JWT_KEY) {
            throw Error(`設定ファイルにjwt(リフレッシュ)の秘密鍵が設定されていません。`);
        }

        if (!RefreshTokenModel.REFRESH_TOKEN_EXPIRES) {
            throw Error(`設定ファイルにリフレッシュトークンの有効期限が設定されていません。`);
        }

        const frontUserId = frontUserIdModel.frontUserId;

        if (!frontUserId) {
            throw Error(`リフレッシュトークンの作成にはユーザーIDが必要です。`);
        }

        const jwtStr = `${frontUserId}`;
        const token = this.jwt.sign({ sub: jwtStr }, RefreshTokenModel.JWT_KEY, { expiresIn: RefreshTokenModel.REFRESH_TOKEN_EXPIRES });

        return new RefreshTokenModel(token);
    }

    get token() {
        return this._token;
    }
}