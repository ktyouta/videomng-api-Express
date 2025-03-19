export class YouTubeDataApiVideoListKeyword {

    private readonly _keyword: string;
    // YouTubeDataApi(動画一覧)のクエリキー(キーワード)
    static readonly QUERYKEY_KEYWORD: string = `q`;

    constructor(keyword: string) {

        if (!keyword) {
            throw Error(`YoutubeDataApiの呼び出しにはキーワードが必須です。`);
        }

        this._keyword = keyword;
    }

    get keywrod() {
        return this._keyword;
    }
}