//YouTube Data Api(動画リスト)のレスポンス
export type YouTubeDataApiVideoListItemType = {
    readonly kind: string;
    readonly etag: string;
    readonly id: {
        readonly kind: string;
        readonly videoId?: string;
        readonly channelId?: string;
        readonly playlistId?: string;
    };
    readonly snippet: {
        readonly publishedAt: string;
        readonly channelId: string;
        readonly title: string;
        readonly description: string;
        readonly thumbnails: {
            readonly default: {
                readonly url: string;
                readonly width: number;
                readonly height: number;
            };
        };
        readonly channelTitle: string;
        readonly liveBroadcastContent: string;
    };
};