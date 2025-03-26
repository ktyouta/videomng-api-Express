export type YouTubeDataApiCommentThreadReplyCommentType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // コメントの一意のID
    readonly id: string;
    // 返信コメントの詳細情報
    readonly snippet: {
        // 表示用のコメント本文（HTMLフォーマット）
        readonly textDisplay: string;
        // 元のコメント本文（プレーンテキスト）
        readonly textOriginal: string;
        // コメント投稿者の表示名
        readonly authorDisplayName: string;
        // コメント投稿者のプロフィール画像URL
        readonly authorProfileImageUrl: string;
        // コメント投稿者のYouTubeチャンネルURL
        readonly authorChannelUrl: string;
        // コメント投稿者のチャンネルID
        readonly authorChannelId: { readonly value: string };
        // 視聴者がこのコメントを評価できるか
        readonly canRate: boolean;
        // 視聴者による評価 ("none", "like", "dislike")
        readonly viewerRating: string;
        // コメントの高評価数
        readonly likeCount: number;
        // コメントの投稿日時
        readonly publishedAt: string;
        // コメントの最終更新日時
        readonly updatedAt: string;
    };
};