import { randomBytes } from "crypto";

export class FrontUserSaltValueModel {

    private readonly _salt: string;
    private static BYTE_SIZE = 16;
    private static ENCODING: BufferEncoding = `hex`;

    private constructor(salt: string) {

        if (!salt) {
            throw Error(`ソルト値が設定されていません。`);
        }

        this._salt = salt;
    }

    /**
     * ソルト値を生成
     */
    static generate() {

        const salt = randomBytes(FrontUserSaltValueModel.BYTE_SIZE).toString(FrontUserSaltValueModel.ENCODING);

        return new FrontUserSaltValueModel(salt);
    }

    static reConstruct(salt: string) {
        return new FrontUserSaltValueModel(salt);
    }

    get salt() {
        return this._salt;
    }
}