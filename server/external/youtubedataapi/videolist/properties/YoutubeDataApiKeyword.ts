export class YouTubeDataApiKeyword {

    private readonly _keyword: string;

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