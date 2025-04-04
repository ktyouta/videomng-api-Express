export class ViewStatusLabelModel {

    private readonly _label: string;

    constructor(label: string) {

        if (!label) {
            throw Error(`視聴状況の名称が設定されていません。`);
        }

        this._label = label;
    }

    get label() {
        return this._label;
    }
}