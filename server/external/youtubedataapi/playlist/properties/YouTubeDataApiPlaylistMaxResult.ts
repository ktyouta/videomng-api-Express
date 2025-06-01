export class YouTubeDataApiPlaylistMaxResult {

    // YouTubeDataApi(動画一覧)のクエリキー(最大取得件数)
    static readonly QUERYKEY: string = `maxResults`;
    // YouTubeDataApi(動画一覧)の最大取得件数(デフォルト)
    private static readonly DEFAULT = `50`;
    // YouTubeDataApi(動画一覧)の最大取得件数
    private readonly _maxResult: string;

    constructor(maxResult: string = YouTubeDataApiPlaylistMaxResult.DEFAULT) {

        if (Number.isNaN(maxResult)) {
            throw Error(`最大取得件数には数値を設定してください。`);
        }

        this._maxResult = maxResult;
    }

    get maxResult() {
        return this._maxResult;
    }
}