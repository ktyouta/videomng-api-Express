export type SearchCommentByKeywordResponseCommentType = {

    // 元のコメント本文
    readonly textOriginal: string;
    // コメントの投稿日時
    readonly publishedAt: string;
    // コメント投稿者の表示名
    readonly authorDisplayName: string;
    // コメントID
    readonly commentId: string;
}