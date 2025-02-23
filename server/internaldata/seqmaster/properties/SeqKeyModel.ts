type seqType = 'front_user_id';

export class SeqKeyModel {

    private readonly _key: string;

    constructor(key: seqType) {

        if (!key) {
            throw Error(`シーケンスのキーが設定されていません。`);
        }

        this._key = key;
    }

    get key() {
        return this._key;
    }
}