import { envConfig } from "../../../../util/const/EnvConfig";

export class YouTubeDataApiApiKey {

    // YouTubeDataApi(動画一覧)のクエリキー(APIキー)
    static readonly QUERYKEY_API_KEY: string = `key`;
    // YouTubeDataApi(動画一覧)のAPIキー
    private readonly _apiKey: string;

    constructor() {

        if (!envConfig.youtubeApiKey) {
            throw Error(`YouTube Data APIのAPIキーが存在しません。`);
        }

        this._apiKey = envConfig.youtubeApiKey
    }

    get apiKey() {
        return this._apiKey;
    }
}