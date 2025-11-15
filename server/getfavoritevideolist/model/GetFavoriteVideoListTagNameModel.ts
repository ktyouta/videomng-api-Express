export class GetFavoriteVideoListTagNameModel {

    private readonly _tagName: string[];

    constructor(tagName: string) {

        this._tagName = tagName ? tagName.split(`,`) : [];
    }

    get tagName() {
        return this._tagName;
    }
}