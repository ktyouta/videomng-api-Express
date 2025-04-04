export class CategoryIdModel {

    private readonly _categoryId: string;

    constructor(categoryId: string) {

        this._categoryId = categoryId;
    }

    get categoryId() {
        return this._categoryId;
    }
}