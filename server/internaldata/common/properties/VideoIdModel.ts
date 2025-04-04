export class VideoIdModel {

    private readonly _videoId: string;

    constructor(videoId: string) {

        if (!videoId) {
            throw Error(`動画IDが設定されていません。`);
        }

        this._videoId = videoId;
    }

    get videoId() {
        return this._videoId;
    }
}