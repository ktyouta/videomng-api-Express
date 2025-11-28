export class IsVisibleAfterFolderAddModel {

    private readonly _value: string;
    public static readonly DEFAULT = `0`;
    public static readonly VISIBLE = `1`;

    constructor(value: string) {

        if (value && value !== IsVisibleAfterFolderAddModel.VISIBLE) {
            throw Error(`フォルダ内動画一覧画面表示フラグの値が不正です。value:${value}`);
        }

        if (!value) {
            value = IsVisibleAfterFolderAddModel.DEFAULT;
        }

        this._value = value;
    }

    get value() {
        return this._value;
    }
}