import { HeaderModel } from '../../header/model/HeaderModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { envConfig } from '../../util/const/EnvConfig';


export class AccessTokenModel {

    private static readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _token: string;
    // ヘッダーのキー
    static readonly HEADER_KEY: string = `access_token`;
    // アクセストークン用のjwtキー
    private static readonly JWT_KEY = envConfig.accessTokenJwtKey;
    // アクセストークン有効期間
    private static readonly ACCESS_TOKEN_EXPIRES = envConfig.accessTokenExpires;

    private constructor(token: string) {
        this._token = token;
    }

    /**
     * トークンを取得
     * @param headerModel 
     * @returns 
     */
    static get(headerModel: HeaderModel) {

        const token = headerModel.get(AccessTokenModel.HEADER_KEY);

        if (!token) {
            throw new Error("アクセストークンがヘッダーに存在しません。");
        }

        return new AccessTokenModel(token);
    }

    /**
     * トークンの発行
     * @param frontUserIdModel 
     * @returns 
     */
    static create(frontUserIdModel: FrontUserIdModel) {

        if (!AccessTokenModel.JWT_KEY) {
            throw Error(`設定ファイルにjwt(アクセス)の秘密鍵が設定されていません。`);
        }

        if (!AccessTokenModel.ACCESS_TOKEN_EXPIRES) {
            throw Error(`設定ファイルにアクセストークンの有効期限が設定されていません。`);
        }

        const frontUserId = frontUserIdModel.frontUserId;

        if (!frontUserId) {
            throw Error(`アクセストークンの作成にはユーザーIDが必要です。`);
        }

        const jwtStr = `${frontUserId}`;
        const token = AccessTokenModel.jwt.sign({ sub: jwtStr }, AccessTokenModel.JWT_KEY, { expiresIn: AccessTokenModel.ACCESS_TOKEN_EXPIRES });

        return new AccessTokenModel(token);
    }

    /**
     * トークンチェック
     * @returns 
     */
    verify() {

        try {

            const decoded = AccessTokenModel.jwt.verify(this.token, AccessTokenModel.JWT_KEY);

            if (!decoded || typeof decoded !== `object`) {
                throw Error(`アクセストークンが不正です。`);
            }

            return decoded;
        } catch (err) {
            throw Error(`アクセストークンの検証に失敗しました。${err}`);
        }
    }

    get token() {
        return this._token;
    }
}