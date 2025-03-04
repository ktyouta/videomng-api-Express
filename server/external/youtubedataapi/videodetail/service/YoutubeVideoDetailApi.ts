import ENV from '../../../../env.json';
import { VideoIdModel } from '../../../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiPath } from '../../common/model/YouTubeDataApiPath';
import { YouTubeDataApiVideoListResponseType } from '../../videolist/model/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiVideoDetailResponseType } from '../model/YouTubeDataApiVideoDetailResponseType';


export class YoutubeVideoDetailApi {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画詳細のレスポンス
    private readonly _response: YouTubeDataApiVideoDetailResponseType;


    private constructor(response: YouTubeDataApiVideoDetailResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(videoIdModel: VideoIdModel) {

        const apiUrl = this.getUrl(videoIdModel);

        try {
            // YouTube Data Api(動画詳細)を呼び出す
            const response: YouTubeDataApiVideoDetailResponseType = await this._apiClient.get(apiUrl);
            return new YoutubeVideoDetailApi(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画詳細)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }


    /**
     * YouTube Data Api(動画リスト)のエンドポイント
     * @param videoId 
     * @returns 
     */
    private static getUrl(videoIdModel: VideoIdModel) {

        const apiPath = new YouTubeDataApiPath();

        if (!ENV.YOUTUBE_DATA_API.DETAIL.API_RESOURCE) {
            throw Error("設定ファイルにYouTubeDataApi(動画詳細)のリソースが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.DETAIL.QUERYKEY_PART) {
            throw Error("設定ファイルにYouTubeDataApi(動画詳細)のクエリキー(part)が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.DETAIL.YOUTUBE_DATA_API_PART) {
            throw Error("設定ファイルにYouTubeDataApi(動画詳細)のpartが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.QUERYKEY_APIKEY) {
            throw Error("設定ファイルにYouTubeDataApiのクエリキー(APIキー)が存在しません。");
        }

        const apiBaseUrl = `${apiPath}${ENV.YOUTUBE_DATA_API.DETAIL.API_RESOURCE}`;

        // クエリパラメータを作成
        const queryParam = this.createQuery(videoIdModel);
        return `${apiBaseUrl}${queryParam ? `?${queryParam}` : ``}`;
    }

    /**
     * api用のクエリパラメータを作成する
     * @param videoId 
     * @returns 
     */
    private static createQuery(videoIdModel: VideoIdModel) {

        // 動画ID
        const videoIdKey = `${ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD}`;
        const videoIdValue = videoIdModel.videoId;
        // APIキー
        const apiKey = `${ENV.YOUTUBE_DATA_API.QUERYKEY_APIKEY}`;
        const apiKeyValue = envConfig.youtubeApiKey;
        // part
        const videoPartKey = `${ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_PART}`;
        const videoPartValue = `${ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_PART}`;

        if (!apiKeyValue) {
            throw Error("設定ファイルにYouTubeDataApiのAPIキーが存在しません。");
        }

        // クエリパラメータ作成用オブジェクト
        const queryBuilder: QueryBuilder = new QueryBuilder(videoIdKey, videoIdValue);
        queryBuilder.add(apiKey, apiKeyValue);
        queryBuilder.add(videoPartKey, videoPartValue);

        // クエリパラメータを作成
        return queryBuilder.createParam();
    }
}