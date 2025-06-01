import { QueryBuilder } from "../../../../util/service/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiPlaylistId } from "../properties/YouTubeDataApiPlaylistId";
import { YouTubeDataApiPlaylistMaxResult } from "../properties/YouTubeDataApiPlaylistMaxResult";
import { YouTubeDataApiPlaylistPart } from "../properties/YouTubeDataApiPlaylistPart";
import { YouTubeDataApiPlaylistNextPageToken } from "../properties/YouTubeDataApiVideoListNextPageToken";


/**
 * YouTube Data APIのプレイリスト取得エンドポイント
 */
export class YouTubeDataApiPlaylistEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/playlistItems`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor(youTubeDataApiPlaylistId: YouTubeDataApiPlaylistId,
        youTubeDataApiPlaylistMaxResult: YouTubeDataApiPlaylistMaxResult,
        youTubeDataApiPlaylistNextPageToken: YouTubeDataApiPlaylistNextPageToken,) {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(
            YouTubeDataApiPlaylistId.QUERYKEY, youTubeDataApiPlaylistId.playlistId);
        queryBuilder.add(YouTubeDataApiPlaylistPart.QUERYKEY, YouTubeDataApiPlaylistPart.VALUE);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiPlaylistMaxResult.QUERYKEY, youTubeDataApiPlaylistMaxResult.maxResult);
        queryBuilder.add(YouTubeDataApiPlaylistNextPageToken.QUERYKEY, youTubeDataApiPlaylistNextPageToken.token);

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiPlaylistEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}