import ENV from '../../../../env.json';
import { VideoIdModel } from '../../../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiVideoListResponseType } from '../../videolist/type/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiVideoDetailResponseType } from '../model/YouTubeDataApiVideoDetailResponseType';


export class YoutubeVideoDetailApi {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画詳細のレスポンス
    private readonly _response: YouTubeDataApiVideoDetailResponseType;
    // YouTubeDataApi(動画詳細)のリソース
    private static readonly API_RESOURCE: string = ENV.YOUTUBE_DATA_API.DETAIL.API_RESOURCE;
    // YouTubeDataApi(動画詳細)のクエリキー(動画ID)
    private static readonly QUERYKEY_VIDEOID: string = ENV.YOUTUBE_DATA_API.DETAIL.QUERYKEY_VIDEOID;
    // YouTubeDataApi(動画詳細)のクエリキー(part)
    private static readonly QUERYKEY_PART: string = ENV.YOUTUBE_DATA_API.DETAIL.QUERYKEY_PART;
    // YouTubeDataApi(動画詳細)のpart
    private static readonly YOUTUBE_DATA_API_PART: string = ENV.YOUTUBE_DATA_API.DETAIL.YOUTUBE_DATA_API_PART;
    // YouTubeDataApi(動画詳細)のクエリキー(APIキー)
    private static readonly QUERYKEY_API_KEY: string = ENV.YOUTUBE_DATA_API.QUERYKEY_API_KEY;
    // YouTubeDataApi(動画詳細)のAPIキー
    private static readonly YOUTUBE_DATA_API_API_KEY = envConfig.youtubeApiKey;


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

        if (!this.API_RESOURCE) {
            throw Error("設定ファイルにYouTubeDataApi(動画詳細)のリソースが存在しません。");
        }

        if (!this.QUERYKEY_PART) {
            throw Error("設定ファイルにYouTubeDataApi(動画詳細)のクエリキー(part)が存在しません。");
        }

        if (!this.YOUTUBE_DATA_API_PART) {
            throw Error("設定ファイルにYouTubeDataApi(動画詳細)のpartが存在しません。");
        }

        if (!this.QUERYKEY_API_KEY) {
            throw Error("設定ファイルにYouTubeDataApiのクエリキー(APIキー)が存在しません。");
        }

        const apiBaseUrl = `${YouTubeDataApiBasePathModel.BASE_PATH}${this.API_RESOURCE}`;

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
        const videoIdValue = videoIdModel.videoId;

        if (!this.YOUTUBE_DATA_API_API_KEY) {
            throw Error("設定ファイルにYouTubeDataApiのAPIキーが存在しません。");
        }

        // クエリパラメータ作成用オブジェクト
        const queryBuilder: QueryBuilder = new QueryBuilder(this.QUERYKEY_VIDEOID, videoIdValue);
        queryBuilder.add(this.QUERYKEY_API_KEY, this.YOUTUBE_DATA_API_API_KEY);
        queryBuilder.add(this.QUERYKEY_PART, this.YOUTUBE_DATA_API_PART);

        // クエリパラメータを作成
        return queryBuilder.createParam();
    }
}