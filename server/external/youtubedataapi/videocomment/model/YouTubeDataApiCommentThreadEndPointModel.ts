import { VideoIdModel } from "../../../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { QueryBuilder } from "../../../../util/service/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiCommentThreadMaxResult } from "../properties/YouTubeDataApiCommentThreadMaxResult";
import { YouTubeDataApiCommentThreadNextPageToken } from "../properties/YouTubeDataApiCommentThreadNextPageToken";
import { YouTubeDataApiCommentThreadPart } from "../properties/YouTubeDataApiCommentThreadPart";
import { YouTubeDataApiCommentThreadVideoId } from "../properties/YouTubeDataApiCommentThreadVideoId";


/**
 * YouTube Data APIの動画コメント取得エンドポイント
 */
export class YouTubeDataApiCommentThreadEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/commentThreads`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(videoIdModel: VideoIdModel,
        youTubeDataApiCommentThreadMaxResult: YouTubeDataApiCommentThreadMaxResult,
        youTubeDataApiCommentThreadNextPageToken: YouTubeDataApiCommentThreadNextPageToken,
    ) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(YouTubeDataApiCommentThreadVideoId.QUERYKEY_VIDEOID, videoIdModel.videoId);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiCommentThreadPart.QUERYKEY_PART, YouTubeDataApiCommentThreadPart.YOUTUBE_DATA_API_PART);
        queryBuilder.add(YouTubeDataApiCommentThreadMaxResult.QUERYKEY_MAXRESULTS, youTubeDataApiCommentThreadMaxResult.maxResult);

        const nextPageToken = youTubeDataApiCommentThreadNextPageToken.token;

        if (nextPageToken) {
            queryBuilder.add(YouTubeDataApiCommentThreadNextPageToken.QUERYKEY_NEXTPAGETOKEN, nextPageToken);
        }

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiCommentThreadEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}