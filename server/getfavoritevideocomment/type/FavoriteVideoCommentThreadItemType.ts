import { YouTubeDataApiCommentThreadReplyType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadReplyType";
import { YouTubeDataApiCommentThreadSnippetType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadSnippetType";
import { FavoriteVideoCommentSnippetType } from "./FavoriteVideoCommentSnippetType";

export type FavoriteVideoCommentThreadItemType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    // コメントスレッドの一意のID
    readonly id: string;
    // コメントスレッドの詳細情報
    readonly snippet: FavoriteVideoCommentSnippetType;
    // 返信コメントのリスト（返信がある場合のみ存在）
    readonly replies?: YouTubeDataApiCommentThreadReplyType;
}