
export class ModeModel {

    // フォルダ表示
    private static readonly MODE_FOLDER = `1` as const;
    // 動画のみ
    private static readonly MODE_ONLY_VIDEO = `2` as const;
    // フォルダID
    private readonly _value: typeof ModeModel.MODE_FOLDER | typeof ModeModel.MODE_ONLY_VIDEO;

    constructor(value: string) {

        const mode: typeof ModeModel.MODE_FOLDER | typeof ModeModel.MODE_ONLY_VIDEO =
            value === ModeModel.MODE_FOLDER || value === ModeModel.MODE_ONLY_VIDEO
                ? value
                : ModeModel.MODE_FOLDER;

        this._value = mode;
    }

    isFolderMode() {
        return this._value === ModeModel.MODE_FOLDER;
    }

    get value() {
        return this._value;
    }
}