export class FavoriteSearchWordId {

    private readonly _id: number;

    constructor(id: number) {

        if (id < 1) {
            throw Error(`お気に入りワードIDが不正です。`);
        }

        this._id = id;
    }

    get id() {
        return this._id;
    }
}
