
export class FolderListModel {

    // フォルダID
    private readonly _value: number[];

    constructor(value: string) {

        const folderList = value ? value.split(`,`).filter((e) => !Number.isNaN(e)).map((e) => parseInt(e)) : [];

        this._value = folderList;
    }

    get value() {
        return this._value;
    }
}