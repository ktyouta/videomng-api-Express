import { QueryBuilder } from "../../../../util/service/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiVideoListNextPageToken } from "../properties/YouTubeDataApiVideoListNextPageToken";
import { YouTubeDataApiVideoListKeyword } from "../properties/YouTubeDataApiVideoListKeyword";
import { YouTubeDataApiVideoListMaxResult } from "../properties/YouTubeDataApiVideoListMaxResult";
import { YouTubeDataApiVideoListPart } from "../properties/YouTubeDataApiVideoListPart";
import { YouTubeDataApiVideoListType } from "../properties/YouTubeDataApiVideoListType";
import { YouTubeDataApiVideoListVideoType } from "../properties/YouTubeDataApiVideoListVideoType";
import { YouTubeDataApiVideoListVideoCategoryId } from "../properties/YouTubeDataApiVideoListVideoCategoryId";


/**
 * YouTube Data APIの動画一覧取得エンドポイント
 */
export class YouTubeDataApiVideoListEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/search`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(youTubeDataApiVideoListKeyword: YouTubeDataApiVideoListKeyword,
        youTubeDataApiVideoListVideoType: YouTubeDataApiVideoListVideoType,
        youTubeDataApiVideoListMaxResult: YouTubeDataApiVideoListMaxResult,
        youTubeDataApiVideoListNextPageToken: YouTubeDataApiVideoListNextPageToken,
        youTubeDataApiVideoListVideoCategoryId: YouTubeDataApiVideoListVideoCategoryId,
    ) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(
            YouTubeDataApiVideoListMaxResult.QUERYKEY_MAXRESULTS, youTubeDataApiVideoListMaxResult.maxResult);
        queryBuilder.add(YouTubeDataApiVideoListKeyword.QUERYKEY_KEYWORD, youTubeDataApiVideoListKeyword.keywrod);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiVideoListPart.QUERYKEY_PART, YouTubeDataApiVideoListPart.YOUTUBE_DATA_API_PART);
        queryBuilder.add(YouTubeDataApiVideoListType.QUERYKEY_TYPE, YouTubeDataApiVideoListType.YOUTUBE_DATA_API_TYPE);

        // 動画種別
        const videoType = youTubeDataApiVideoListVideoType.type;

        if (videoType) {
            queryBuilder.add(YouTubeDataApiVideoListVideoType.QUERYKEY_EVENT_TYPE_KEY, videoType);
        }

        // 次データ取得用トークン
        const nextPageToken = youTubeDataApiVideoListNextPageToken.token;

        if (nextPageToken) {
            queryBuilder.add(YouTubeDataApiVideoListNextPageToken.QUERYKEY_NEXTPAGETOKEN, nextPageToken);
        }

        // 動画カテゴリ
        const videoCategory = youTubeDataApiVideoListVideoCategoryId.value;

        if (videoCategory) {
            queryBuilder.add(YouTubeDataApiVideoListVideoCategoryId.QUERYKEY, videoCategory);
        }

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiVideoListEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}