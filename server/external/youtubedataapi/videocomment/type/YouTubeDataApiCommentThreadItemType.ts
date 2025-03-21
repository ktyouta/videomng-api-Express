import { YouTubeDataApiCommentThreadSnippetType } from "./YouTubeDataApiCommentThreadSnippetType";
import { YouTubeDataApiCommentThreadReplyType } from "./YouTubeDataApiCommentThreadReplyType";

export type YouTubeDataApiCommentThreadItemType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // コメントスレッドの一意のID
    readonly id: string;
    // コメントスレッドの詳細情報
    readonly snippet: YouTubeDataApiCommentThreadSnippetType;
    // 返信コメントのリスト（返信がある場合のみ存在）
    readonly replies?: YouTubeDataApiCommentThreadReplyType;
}