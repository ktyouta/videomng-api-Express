export type YouTubeDataApiCommentDetailSnippetType = {
    // コメントを投稿したチャンネルの情報
    readonly authorDisplayName: string;
    readonly authorProfileImageUrl: string;
    readonly authorChannelUrl: string;
    readonly authorChannelId: { value: string };
    // コメントの本文
    readonly textDisplay: string;
    readonly textOriginal: string;
    // 投稿日時
    readonly publishedAt: string;
    readonly updatedAt: string;
    // このコメントの動画ID
    readonly videoId: string;
    // 親コメントID（スレッドの返信の場合のみ存在）
    readonly parentId?: string;
    // 高評価数
    readonly likeCount: number;
    // フラグ情報（モデレーション済みなど）
    readonly moderationStatus?: string;
};