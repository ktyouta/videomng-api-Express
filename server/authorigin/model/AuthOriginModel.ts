import { AUTH_ALLOWED_ORIGINS } from '../../common/const/AuthAllowedOrigins';
import { HeaderModel } from '../../header/model/HeaderModel';


export class AuthOriginModel {

    // ヘッダのキー
    static readonly HEADER_KEY: string = `origin`;
    private readonly _origin: string;

    constructor(headerModel: HeaderModel) {


        const origin = headerModel.get(AuthOriginModel.HEADER_KEY);

        if (!origin) {
            throw Error(`Origin未設定`);
        }

        this._origin = origin;
    }

    /**
     * 許可Originチェック
     * @returns 
     */
    isAllowed() {
        return AUTH_ALLOWED_ORIGINS.some(e => e === this._origin);
    }
}