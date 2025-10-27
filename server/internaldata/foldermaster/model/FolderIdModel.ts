export class FolderIdModel {

    private readonly _id: number;

    constructor(id: number) {

        if (id < 1) {
            throw Error(`フォルダIDが不正です。`);
        }

        this._id = id;
    }

    get id() {
        return this._id;
    }
}