export class TagNameModel {

    private readonly _tagName: string;

    constructor(tagName: string) {

        if (!tagName) {
            throw Error(`タグ名が設定されていません。`);
        }

        this._tagName = tagName;
    }

    get tagName() {
        return this._tagName;
    }
}