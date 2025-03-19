import { VideoIdModel } from "../../../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { QueryBuilder } from "../../../../util/service/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiVideoDetailPart } from "../properties/YouTubeDataApiVideoDetailPart";
import { YouTubeDataApiVideoDetailResource } from "../properties/YouTubeDataApiVideoDetailResource";
import { YouTubeDataApiVideoDetailVideoId } from "../properties/YouTubeDataApiVideoDetailVideoId";


/**
 * YouTube Data APIの動画詳細取得エンドポイント
 */
export class YouTubeDataApiVideoDetailEndPointModel {

    private readonly _endpoint: string;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(videoIdModel: VideoIdModel) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(YouTubeDataApiVideoDetailVideoId.QUERYKEY_VIDEOID, videoIdModel.videoId);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiVideoDetailPart.QUERYKEY_PART, YouTubeDataApiVideoDetailPart.YOUTUBE_DATA_API_PART);

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiBasePathModel.BASE_PATH}${YouTubeDataApiVideoDetailResource.API_RESOURCE}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}