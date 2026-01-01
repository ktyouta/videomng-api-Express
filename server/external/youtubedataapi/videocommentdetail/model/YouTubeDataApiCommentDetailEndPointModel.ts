import { QueryBuilder } from "../../../../util/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiCommentDetailCommentIdList } from "../properties/YouTubeDataApiCommentDetailCommentIdList";
import { YouTubeDataApiCommentDetailPart } from "../properties/YouTubeDataApiCommentDetailPart";


/**
 * YouTube Data APIの動画コメント詳細取得エンドポイント
 */
export class YouTubeDataApiCommentDetailEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/comments`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(youTubeDataApiCommentDetailCommentIdList: YouTubeDataApiCommentDetailCommentIdList,) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiCommentDetailPart.QUERYKEY_PART, YouTubeDataApiCommentDetailPart.YOUTUBE_DATA_API_PART);

        const commentId = youTubeDataApiCommentDetailCommentIdList.join();
        queryBuilder.add(YouTubeDataApiCommentDetailCommentIdList.QUERYKEY_COMMENTID, commentId);

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiCommentDetailEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}