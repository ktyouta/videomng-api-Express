import { envConfig } from "../../common/const/EnvConfig";

export class PepperModel {

    private readonly _value: string;
    // ペッパー値(環境変数設定値)
    private readonly PEPPER_VALUE = envConfig.pepper;

    constructor() {

        if (!this.PEPPER_VALUE) {
            throw Error(`環境変数にpepperが設定されていません。`);
        }

        this._value = this.PEPPER_VALUE;
    }

    get value() {
        return this._value;
    }
}