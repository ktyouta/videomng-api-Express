import ENV from '../../../../env.json';

export class YouTubeDataApiBasePathModel {

    private readonly _basePath: string;

    constructor() {

        if (!ENV.YOUTUBE_DATA_API.PROTOCOL) {
            throw Error("設定ファイルにプロトコルが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.DOMAIN) {
            throw Error("設定ファイルにYouTubeDataApiのドメインが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.PATH) {
            throw Error("設定ファイルにYouTubeDataApiのパスが存在しません。");
        }

        this._basePath = `${ENV.YOUTUBE_DATA_API.PROTOCOL}${ENV.YOUTUBE_DATA_API.DOMAIN}${ENV.YOUTUBE_DATA_API.PATH}`;
    }

    get basePath() {
        return this._basePath;
    }
}