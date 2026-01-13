import { HeaderModel } from '../../header/model/HeaderModel';


export class RefreshCustomHeaderModel {

    // ヘッダのキー
    static readonly HEADER_KEY: string = `X-CSRF-Token`;
    // カスタムヘッダ設定値
    static readonly HEADER_VALUE: string = `web`;
    private readonly _value: string;

    constructor(headerModel: HeaderModel) {

        const value = headerModel.get(RefreshCustomHeaderModel.HEADER_KEY);

        if (!value) {
            throw Error(`リフレッシュ用のヘッダ未設定`);
        }

        this._value = value;
    }

    /**
     * カスタムヘッダ設定値チェック
     * @returns 
     */
    isValid() {
        return this._value === RefreshCustomHeaderModel.HEADER_VALUE;
    }
}