export class FavoriteSearchWord {

    private readonly _value: string;

    constructor(value: string) {

        if (!value || !value.trim()) {
            throw Error(`お気に入りワードが設定されていません。`);
        }

        this._value = value.trim();
    }

    get value() {
        return this._value;
    }
}