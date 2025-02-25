export class YouTubeDataApiVideoId {

    private readonly _videoId: string;

    constructor(videoId: string) {

        if (!videoId) {
            throw Error(`YoutubeDataApiの呼び出しにはVIDEO_IDが必須です。`);
        }

        this._videoId = videoId;
    }

    get videoId() {
        return this._videoId;
    }
}