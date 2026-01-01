import { QueryBuilder } from "../../../../util/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiChannelId } from "../properties/YouTubeDataApiChannelId";
import { YouTubeDataApiChannelPart } from "../properties/YouTubeDataApiChannelPart";


/**
 * YouTube Data APIのチャンネル取得エンドポイント
 */
export class YouTubeDataApiChannelEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/channels`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(youTubeDataApiChannelId: YouTubeDataApiChannelId,) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(
            YouTubeDataApiChannelId.QUERYKEY, youTubeDataApiChannelId.channelId);
        queryBuilder.add(YouTubeDataApiChannelPart.QUERYKEY, YouTubeDataApiChannelPart.VALUE);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiChannelEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}