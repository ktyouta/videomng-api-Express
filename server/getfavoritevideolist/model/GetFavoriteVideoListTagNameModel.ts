export class GetFavoriteVideoListTagNameModel {

    private readonly _tagName: string;

    constructor(tagName: string) {

        this._tagName = tagName;
    }

    get tagName() {
        return this._tagName;
    }
}