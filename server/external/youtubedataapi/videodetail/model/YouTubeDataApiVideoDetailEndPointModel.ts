import { VideoIdModel } from "../../../../internaldata/common/properties/VideoIdModel";
import { QueryBuilder } from "../../../../util/service/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiVideoDetailPart } from "../properties/YouTubeDataApiVideoDetailPart";
import { YouTubeDataApiVideoDetailVideoId } from "../properties/YouTubeDataApiVideoDetailVideoId";
import { VideoIdListModel } from "./VideoIdListModel";


type propsType = VideoIdModel | VideoIdListModel;

/**
 * YouTube Data APIの動画詳細取得エンドポイント
 */
export class YouTubeDataApiVideoDetailEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/videos`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(videoIdModel: propsType) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(YouTubeDataApiVideoDetailVideoId.QUERYKEY_VIDEOID, videoIdModel.videoId);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiVideoDetailPart.QUERYKEY_PART, YouTubeDataApiVideoDetailPart.YOUTUBE_DATA_API_PART);

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiVideoDetailEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}