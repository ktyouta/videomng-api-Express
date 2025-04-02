export class YouTubeDataApiVideoListVideoCategoryId {

    // YouTubeDataApi(動画リスト)のクエリキー(カテゴリ)
    static readonly QUERYKEY: string = `videoCategoryId`;
    // YouTubeDataApi(動画リスト)のカテゴリ
    private readonly _value: string;

    constructor(videoCategory: string = ``) {

        this._value = videoCategory;
    }

    get value() {
        return this._value;
    }
}