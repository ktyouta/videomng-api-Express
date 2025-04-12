export class TagIdModel {

    private readonly _tagId: number;

    constructor(tagId: number) {

        this._tagId = tagId;
    }

    get tagId() {
        return this._tagId;
    }
}