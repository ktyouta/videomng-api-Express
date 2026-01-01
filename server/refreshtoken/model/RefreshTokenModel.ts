import { CookieOptions } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '../../common/const/EnvConfig';
import { IS_ENV_PRODUCTION } from '../../common/const/EnvProductionConst';
import { CookieModel } from '../../cookie/model/CookieModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { parseDuration } from '../../util/ParseDuration';


export class RefreshTokenModel {

    private static readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _token: string;
    // cookieのキー
    static readonly COOKIE_KEY: string = `refresh_token`;
    // リフレッシュトークン用のjwtキー
    private static readonly JWT_KEY = envConfig.refreshTokenExpires;
    // リフレッシュトークン有効期間
    private static readonly REFRESH_TOKEN_EXPIRES = envConfig.refreshTokenExpires;
    // cookieオプション
    private static readonly COOKIE_BASE_OPTION: CookieOptions = {
        httpOnly: true,
        secure: IS_ENV_PRODUCTION,
        sameSite: IS_ENV_PRODUCTION ? 'none' : 'lax',
    };
    // cookieオプション(生成)
    static readonly COOKIE_SET_OPTION: CookieOptions = {
        ...RefreshTokenModel.COOKIE_BASE_OPTION,
        maxAge: parseDuration(
            RefreshTokenModel.REFRESH_TOKEN_EXPIRES
        ),
    };
    // cookieオプション(失効)
    static readonly COOKIE_CLEAR_OPTION: CookieOptions = {
        ...RefreshTokenModel.COOKIE_BASE_OPTION,
    };

    private constructor(token: string) {
        this._token = token;
    }

    /**
     * トークンを取得
     * @param cookieModel 
     * @returns 
     */
    static get(cookieModel: CookieModel) {

        const token = cookieModel.cookie[RefreshTokenModel.COOKIE_KEY];

        if (!token) {
            throw Error(`トークンが存在しません。`);
        }

        return new RefreshTokenModel(token);
    }

    /**
     * トークンの発行
     * @param frontUserIdModel 
     * @returns 
     */
    static create(frontUserIdModel: FrontUserIdModel) {

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
        const nowSec = Math.floor(Date.now() / 1000);

        const token = RefreshTokenModel.jwt.sign(
            {
                sub: jwtStr,
                iat: nowSec,
                sessionStartedAt: nowSec,
            },
            RefreshTokenModel.JWT_KEY,
            { expiresIn: RefreshTokenModel.REFRESH_TOKEN_EXPIRES },
        );

        return new RefreshTokenModel(token);
    }

    /**
     * トークン再発行
     */
    static refresh(refreshTokenModel: RefreshTokenModel) {

        const decoded = refreshTokenModel.verify();
        const nowSec = Math.floor(Date.now() / 1000);

        if (!decoded.sub || !decoded.iat) {
            throw Error(`Claimの設定が不足しています。`);
        }

        const token = RefreshTokenModel.jwt.sign(
            {
                sub: decoded.sub,
                iat: decoded.iat,
                sessionStartedAt: nowSec,
            },
            RefreshTokenModel.JWT_KEY,
            { expiresIn: RefreshTokenModel.REFRESH_TOKEN_EXPIRES },
        );

        return new RefreshTokenModel(token);
    }

    /**
     * トークンチェック
     * @returns 
     */
    verify() {

        try {

            const decoded = RefreshTokenModel.jwt.verify(this.token, RefreshTokenModel.JWT_KEY) as JwtPayload;

            if (!decoded || typeof decoded !== `object`) {
                throw Error(`アクセストークンが不正です。`);
            }

            return decoded;
        } catch (err) {
            throw Error(`アクセストークンの検証に失敗しました。${err}`);
        }
    }

    /**
     * 絶対期限チェック
     */
    isAbsoluteExpired() {

        const decode = this.verify();

        if (!decode.iat) {
            throw new Error('iat未設定');
        }

        const nowMs = Date.now();
        const iatMs = decode.iat * 1000;

        return nowMs - iatMs > parseDuration(RefreshTokenModel.REFRESH_TOKEN_EXPIRES);
    }

    get token() {
        return this._token;
    }
}