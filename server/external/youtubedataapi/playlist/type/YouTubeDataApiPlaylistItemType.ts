// プレイリストごとのデータ
export type YouTubeDataApiPlaylistItemType = {
    // 各動画アイテムの種類（例: "youtube#playlistItem"）
    kind: string;
    // 各アイテムのETag
    etag: string;
    // playlistItem の ID（このプレイリスト内での一意ID）
    id: string;
    // 各動画のスニペット情報
    snippet: {
        // プレイリストID（元のプレイリスト）
        playlistId: string;
        // プレイリスト内での動画の順序（0から始まる）
        position: number;
        // 動画のタイトル
        title: string;
        // 動画の説明
        description: string;
        // サムネイル画像（複数解像度あり）
        thumbnails: {
            default?: {
                url: string;
                width: number;
                height: number;
            };
            medium?: {
                url: string;
                width: number;
                height: number;
            };
            high?: {
                url: string;
                width: number;
                height: number;
            };
            standard?: {
                url: string;
                width: number;
                height: number;
            };
            maxres?: {
                url: string;
                width: number;
                height: number;
            };
        };
        // 動画の公開日時（ISO8601）
        publishedAt: string;
        // チャンネルのタイトル（例: "公式チャンネル"）
        channelTitle: string;
        // チャンネルID
        channelId: string;
        // 再生される動画の情報
        resourceId: {
            // リソース種別（基本的に "youtube#video"）
            kind: string;
            // 対象の動画ID（例: "dQw4w9WgXcQ"）
            videoId: string;
        };
    };
};