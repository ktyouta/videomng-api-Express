export class SeqKeyModel {

    private readonly _key: string;

    constructor(key: string) {

        if (!key) {
            throw Error(`シーケンスのキーが設定されていません。`);
        }

        this._key = key;
    }

    get key() {
        return this._key;
    }
}