import { YouTubeDataApiCommentThreadSnipetType } from "./YouTubeDataApiCommentThreadSnipetType";
import { YouTubeDataApiCommentThreadReplyType } from "./YouTubeDataApiCommentThreadReplyType";
import { YouTubeDataApiCommentThreadItemType } from "./YouTubeDataApiCommentThreadItemType";

//YouTube Data Api(動画コメント)のレスポンス
export type YouTubeDataApiCommentThreadResponseType = {
    // APIレスポンスの種類
    readonly kind: string;
    // APIレスポンスのETag
    readonly etag: string;
    readonly nextPageToken: string;
    readonly pageInfo: {
        readonly totalResults: number,
        readonly resultsPerPage: number
    };
    // コメント情報
    readonly items: YouTubeDataApiCommentThreadItemType[];
}