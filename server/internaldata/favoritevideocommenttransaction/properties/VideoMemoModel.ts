export class VideoMemoModel {

    private readonly _videoMemo: string;

    constructor(videoMemo: string) {

        this._videoMemo = videoMemo;
    }

    get videoMemo() {
        return this._videoMemo;
    }
}