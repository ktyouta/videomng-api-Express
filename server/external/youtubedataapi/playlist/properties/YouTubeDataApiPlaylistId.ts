export class YouTubeDataApiPlaylistId {

    private readonly _playlistId: string;
    // YouTubeDataApi(プレイリスト)のクエリキー(キーワード)
    static readonly QUERYKEY: string = `playlistId`;

    constructor(keyword: string) {

        if (!keyword) {
            throw Error(`YoutubeDataApi(プレイリスト)の呼び出しにはプレイリストIDが必須です。`);
        }

        this._playlistId = keyword;
    }

    get playlistId() {
        return this._playlistId;
    }
}