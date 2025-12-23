import crypto from "crypto";
import { CookieOptions } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";
import { HeaderModel } from "../../header/model/HeaderModel";
import { IS_ENV_PRODUCTION } from '../../util/const/EnvProductionConst';

export class CsrfTokenModel {

    // トークン
    private readonly _token: string;
    // cookieのキー
    static readonly COOKIE_KEY: string = `csrf_token`;
    // ヘッダーのキー
    static readonly HEADER_KEY: string = `csrf_token`;
    // cookieオプション
    static readonly COOKIE_OPTION: CookieOptions = {
        httpOnly: false,
        secure: IS_ENV_PRODUCTION,
        sameSite: IS_ENV_PRODUCTION ? 'none' : 'lax',
    };

    private constructor(token: string) {

        this._token = token;
    }

    static create() {
        const token = crypto.randomBytes(32).toString("hex");
        return new CsrfTokenModel(token);
    }

    static fromCookie(cookieModel: CookieModel) {

        const token = cookieModel.cookie[CsrfTokenModel.COOKIE_KEY];
        return new CsrfTokenModel(token);
    }

    static fromHeader(headerModel: HeaderModel) {

        const token = headerModel.get(CsrfTokenModel.HEADER_KEY);

        if (!token) {
            throw new Error("CSRFトークンがヘッダーに存在しません。");
        }

        return new CsrfTokenModel(token);
    }

    get value() {
        return this._token;
    }

    equal(token: CsrfTokenModel) {
        return this._token === token.value;
    }
}