import { YouTubeDataApiCommentThreadSnipetType } from "./YouTubeDataApiCommentThreadSnipetType";
import { YouTubeDataApiCommentThreadReplyType } from "./YouTubeDataApiCommentThreadReplyType";

//YouTube Data Api(動画コメント)のレスポンス
export type YouTubeDataApiCommentThreadResponseType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // コメントスレッドの一意のID
    readonly id: string;
    // コメントスレッドの詳細情報
    readonly snippet: YouTubeDataApiCommentThreadSnipetType;
    // 返信コメントのリスト（返信がある場合のみ存在）
    readonly replies?: YouTubeDataApiCommentThreadReplyType;
}