export class ParentFolderIdModel {

    private readonly _id: number | null;

    constructor(id: number | undefined) {

        if (!!id && id < 1) {
            throw Error(`親フォルダIDが不正です。id:${id}`);
        }

        this._id = id || null;
    }

    get id() {
        return this._id;
    }
}