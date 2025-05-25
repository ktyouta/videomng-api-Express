export class FavoriteVideoSortLabelModel {

    private readonly _label: string;

    constructor(label: string) {

        if (!label) {
            throw Error(`ソートの名称が設定されていません。`);
        }

        this._label = label;
    }

    get label() {
        return this._label;
    }
}