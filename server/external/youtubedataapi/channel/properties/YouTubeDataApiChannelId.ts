export class YouTubeDataApiChannelId {

    private readonly _channelId: string;
    // YouTubeDataApi(チャンネル)のクエリキー(キーワード)
    static readonly QUERYKEY: string = `id`;

    constructor(keyword: string) {

        if (!keyword) {
            throw Error(`YoutubeDataApi(チャンネル)の呼び出しにはチャンネルIDが必須です。`);
        }

        this._channelId = keyword;
    }

    get channelId() {
        return this._channelId;
    }
}