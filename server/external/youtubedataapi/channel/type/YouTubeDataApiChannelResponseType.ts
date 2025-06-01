import { YouTubeDataApiChannelItemType } from "./YouTubeDataApiChannelItemType";

//YouTube Data Api(チャンネル)のレスポンス
export type YouTubeDataApiChannelResponseType = {
    // レスポンス全体の種類（例: "youtube#channelListResponse"）
    readonly kind: string;
    // レスポンスのETag（キャッシュ等に使われる）
    readonly etag: string;
    // ページ情報（全件数・1ページあたりの件数）
    readonly pageInfo: {
        // 総件数（通常は 0 または 1）
        totalResults: number;
        // 1ページあたりの件数
        resultsPerPage: number;
    }
    // チャンネルごとのデータ
    readonly items: YouTubeDataApiChannelItemType[];
};
