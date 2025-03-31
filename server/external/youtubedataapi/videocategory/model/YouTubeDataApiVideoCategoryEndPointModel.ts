import { VideoIdModel } from "../../../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { QueryBuilder } from "../../../../util/service/QueryBuilder";
import { YouTubeDataApiBasePathModel } from "../../common/model/YouTubeDataApiBasePathModel";
import { YouTubeDataApiApiKey } from "../../common/properties/YouTubeDataApiApiKey";
import { YouTubeDataApiVideoCategoryPart } from "../properties/YouTubeDataApiVideoCategoryPart";
import { YouTubeDataApiVideoCategoryRegionCode } from "../properties/YouTubeDataApiVideoCategoryRegionCode";


/**
 * YouTube Data APIの動画カテゴリ取得エンドポイント
 */
export class YouTubeDataApiVideoCategoryEndPointModel {

    private readonly _endpoint: string;
    // パス
    private static readonly PATH: string = `${YouTubeDataApiBasePathModel.BASE_PATH}/videoCategories`;
    // APIキー
    private readonly youTubeDataApiApiKey: YouTubeDataApiApiKey = new YouTubeDataApiApiKey();


    constructor() {

        // クエリパラメータを作成
        const queryBuilder: QueryBuilder = new QueryBuilder(YouTubeDataApiVideoCategoryPart.QUERYKEY, YouTubeDataApiVideoCategoryPart.VALUE);
        queryBuilder.add(YouTubeDataApiApiKey.QUERYKEY_API_KEY, this.youTubeDataApiApiKey.apiKey);
        queryBuilder.add(YouTubeDataApiVideoCategoryRegionCode.QUERYKEY, YouTubeDataApiVideoCategoryRegionCode.VALUE);

        const queryParam = queryBuilder.createParam();

        this._endpoint = `${YouTubeDataApiVideoCategoryEndPointModel.PATH}${queryParam ? `?${queryParam}` : ``}`
    }

    get endpoint() {
        return this._endpoint;
    }
}