export class YouTubeDataApiCommentThreadNextPageToken {

    // YouTubeDataApi(動画コメント)のクエリキー(トークン)
    static readonly QUERYKEY_NEXTPAGETOKEN: string = `pageToken`;
    // YouTubeDataApi(動画コメント)の最大取得件数
    private readonly _nextpageToken: string;

    constructor(nextpageToken: string = ``) {

        this._nextpageToken = nextpageToken;
    }

    get nextpageToken() {
        return this._nextpageToken;
    }
}