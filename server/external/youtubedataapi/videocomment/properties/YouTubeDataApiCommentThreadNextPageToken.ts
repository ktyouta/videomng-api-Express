export class YouTubeDataApiCommentThreadNextPageToken {

    // YouTubeDataApi(動画コメント)のクエリキー(トークン)
    static readonly QUERYKEY_NEXTPAGETOKEN: string = `pageToken`;
    // YouTubeDataApi(動画コメント)の最大取得件数
    private readonly _token: string;

    constructor(nextpageToken: string = ``) {

        this._token = nextpageToken;
    }

    get token() {
        return this._token;
    }
}