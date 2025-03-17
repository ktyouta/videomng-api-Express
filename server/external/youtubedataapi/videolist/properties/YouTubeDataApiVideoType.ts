export type VideoType = "all" | "live";

export class YouTubeDataApiVideoType {

    private readonly _type: string;
    // 種別(すべて)
    private static readonly TYPE_ALL: string = "";
    // 種別(アーカイブ)
    private static readonly TYPE_ARCHIVE: string = "completed";


    constructor(videoType: VideoType) {

        let type = "";

        switch (videoType) {
            case "all":
                type = YouTubeDataApiVideoType.TYPE_ALL;
                break;
            case "live":
                type = YouTubeDataApiVideoType.TYPE_ARCHIVE;
                break;
            default:
                type = YouTubeDataApiVideoType.TYPE_ALL;
                break;
        }

        this._type = type;
    }

    get type() {
        return this._type;
    }
}