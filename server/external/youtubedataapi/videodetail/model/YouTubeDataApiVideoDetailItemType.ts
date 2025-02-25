//YouTube Data Api(動画詳細)のレスポンス
export type YouTubeDataApiVideoDetailItemType = {
    readonly kind: string;
    readonly etag: string;
    readonly id: string;
    // 動画の基本情報（タイトル、説明、サムネイル、チャンネル情報等）
    readonly snippet: {
        readonly publishedAt: string;
        readonly channelId: string;
        readonly title: string;
        readonly description: string;
        readonly thumbnails: {
            readonly default: { url: string; width: number; height: number };
            readonly medium?: { url: string; width: number; height: number };
            readonly high?: { url: string; width: number; height: number };
        };
        readonly channelTitle: string;
        readonly tags?: string[];
        readonly categoryId: string;
        readonly liveBroadcastContent: string;
    };
    // 動画の統計データ（再生回数、いいね数、コメント数等）
    readonly statistics?: {
        readonly viewCount: string;
        readonly likeCount?: string;
        readonly dislikeCount?: string;
        readonly favoriteCount?: string;
        readonly commentCount?: string;
    };
    // 動画の詳細情報（再生時間、解像度、字幕の有無等）
    readonly contentDetails?: {
        readonly duration: string;
        readonly dimension: string;
        readonly definition: string;
        readonly caption: string;
        readonly licensedContent: boolean;
    };
};