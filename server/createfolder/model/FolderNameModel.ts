export class FolderNameModel {

    private readonly _name: string;

    constructor(name: string) {

        if (!name) {
            throw Error(`フォルダ名が指定されていません。`);
        }

        this._name = name;
    }

    get name() {
        return this._name;
    }
}