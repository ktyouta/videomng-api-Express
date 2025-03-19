export type VideoType = "all" | "live";

export class YouTubeDataApiVideoListVideoType {

    private readonly _type: string;
    // YouTubeDataApi(動画一覧)のクエリキー(動画種別)
    static readonly QUERYKEY_EVENT_TYPE_KEY: string = `eventType`;
    // 種別(すべて)
    private static readonly TYPE_ALL: string = "";
    // 種別(アーカイブ)
    private static readonly TYPE_ARCHIVE: string = "completed";


    constructor(videoType: VideoType) {

        let type = "";

        switch (videoType) {
            case "all":
                type = YouTubeDataApiVideoListVideoType.TYPE_ALL;
                break;
            case "live":
                type = YouTubeDataApiVideoListVideoType.TYPE_ARCHIVE;
                break;
            default:
                type = YouTubeDataApiVideoListVideoType.TYPE_ALL;
                break;
        }

        this._type = type;
    }

    get type() {
        return this._type;
    }
}