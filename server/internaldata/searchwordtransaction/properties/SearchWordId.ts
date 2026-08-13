export class SearchWordId {

    private readonly _id: number;

    constructor(id: number) {

        if (id < 1) {
            throw Error(`検索実績IDが不正です。`);
        }

        this._id = id;
    }

    get id() {
        return this._id;
    }
}
