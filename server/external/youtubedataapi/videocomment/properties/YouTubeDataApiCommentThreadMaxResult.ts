export class YouTubeDataApiCommentThreadMaxResult {

    // YouTubeDataApi(動画コメント)のクエリキー(最大取得件数)
    static readonly QUERYKEY_MAXRESULTS: string = `maxResults`;
    // YouTubeDataApi(動画コメント)の最大取得件数(デフォルト)
    private static readonly DEFAULT = `100`;
    // YouTubeDataApi(動画コメント)の最大取得件数
    private readonly _maxResult: string;

    constructor(maxResult: string = YouTubeDataApiCommentThreadMaxResult.DEFAULT) {

        if (Number.isNaN(maxResult)) {
            throw Error(`最大取得件数には数値を設定してください。`);
        }

        this._maxResult = maxResult;
    }

    get maxResult() {
        return this._maxResult;
    }
}