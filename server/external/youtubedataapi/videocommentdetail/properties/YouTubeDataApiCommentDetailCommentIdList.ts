import { CommentIdModel } from "../../../../internaldata/common/properties/CommentIdModel";
import { VideoIdModel } from "../../../../internaldata/common/properties/VideoIdModel";

export class YouTubeDataApiCommentDetailCommentIdList {

    // YouTubeDataApi(動画コメント)のクエリキー(コメントID)
    static readonly QUERYKEY_COMMENTID: string = `id`;
    // コメントIDリスト
    private _commentIdModelList: CommentIdModel[];

    constructor() {
        this._commentIdModelList = [];
    }

    add(commentIdModel: CommentIdModel) {
        this._commentIdModelList.push(commentIdModel);
    }

    join() {
        return this._commentIdModelList.map((e) => e.commentId).join(`,`);
    }
}