import { YouTubeDataApiKeyword } from "../properties/YouTubeDataApiKeyword";
import { YouTubeDataApiVideoType } from "../properties/YouTubeDataApiVideoType";

// YouTube Data Api動画リスト取得APIのリクエスト
export class YouTubeDataApiVideoListRequestType {
    private readonly _youTubeDataApiKeyword: YouTubeDataApiKeyword;
    private readonly _videoType: YouTubeDataApiVideoType;

    constructor(youTubeDataApiKeyword: YouTubeDataApiKeyword,
        videoType: YouTubeDataApiVideoType
    ) {

        this._youTubeDataApiKeyword = youTubeDataApiKeyword;
        this._videoType = videoType;
    }

    get youTubeDataApiKeyword() {
        return this._youTubeDataApiKeyword.keywrod;
    }

    get videoType() {
        return this._videoType.type;
    }
}