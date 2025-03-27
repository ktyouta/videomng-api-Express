import { YouTubeDataApiCommentDetailSnippetType } from "./YouTubeDataApiCommentDetailSnippetType";

export type YouTubeDataApiCommentDetailItemType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // コメントの一意のID
    readonly id: string;
    // コメントの詳細情報
    readonly snippet: YouTubeDataApiCommentDetailSnippetType;
}