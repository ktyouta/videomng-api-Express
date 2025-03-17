export type VideoType = "video" | "live";

export class YouTubeDataApiVideoType {

    private readonly _type: string;
    // 種別(動画)
    private static readonly TYPE_VIDEO: string = "";
    // 種別(アーカイブ)
    private static readonly TYPE_ARCHIVE: string = "completed";


    constructor(videoType: VideoType) {

        let type = "";

        switch (videoType) {
            case "video":
                type = YouTubeDataApiVideoType.TYPE_VIDEO;
                break;
            case "live":
                type = YouTubeDataApiVideoType.TYPE_ARCHIVE;
                break;
            default:
                type = YouTubeDataApiVideoType.TYPE_ARCHIVE;
                break;
        }

        this._type = type;
    }

    get type() {
        return this._type;
    }
}