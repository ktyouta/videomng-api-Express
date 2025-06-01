export class YouTubeDataApiPlaylistNextPageToken {

    // YouTubeDataApi(プレイリスト)のクエリキー(トークン)
    static readonly QUERYKEY: string = `pageToken`;
    // YouTubeDataApi(プレイリスト)の最大取得件数
    private readonly _token: string;

    constructor(nextpageToken: string = ``) {

        this._token = nextpageToken;
    }

    get token() {
        return this._token;
    }
}