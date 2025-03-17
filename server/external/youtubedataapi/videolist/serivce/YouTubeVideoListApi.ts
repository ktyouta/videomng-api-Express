import ENV from '../../../../env.json';
import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiVideoListRequestType } from '../model/YouTubeDataApiVideoListRequestType';
import { YouTubeDataApiVideoListResponseType } from '../model/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiKeyword } from '../properties/YouTubeDataApiKeyword';


export class YouTubeVideoListApi {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画リストのレスポンス
    private readonly _response: YouTubeDataApiVideoListResponseType;
    // YouTubeDataApi(動画一覧)のリソース
    private static readonly API_RESOURCE: string = ENV.YOUTUBE_DATA_API.LIST.API_RESOURCE;
    // YouTubeDataApi(動画一覧)のクエリキー(キーワード)
    private static readonly QUERYKEY_KEYWORD: string = ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD;
    // YouTubeDataApi(動画一覧)のクエリキー(最大取得件数)
    private static readonly QUERYKEY_MAXRESULTS: string = ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_MAXRESULTS;
    // YouTubeDataApi(動画一覧)の最大取得件数
    private static readonly YOUTUBE_DATA_API_MAXRESULTS: string = ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_MAXRESULTS;
    // YouTubeDataApi(動画一覧)のクエリキー(part)
    private static readonly QUERYKEY_PART: string = ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_PART;
    // YouTubeDataApi(動画一覧)のpart
    private static readonly YOUTUBE_DATA_API_PART: string = ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_PART;
    // YouTubeDataApi(動画一覧)のクエリキー(APIキー)
    private static readonly QUERYKEY_API_KEY: string = ENV.YOUTUBE_DATA_API.QUERYKEY_API_KEY;
    // YouTubeDataApi(動画一覧)のAPIキー
    private static readonly YOUTUBE_DATA_API_API_KEY = envConfig.youtubeApiKey;
    // YouTubeDataApi(動画一覧)のクエリキー(動画種別)
    private static readonly QUERYKEY_EVENT_TYPE_KEY: string = ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_EVENT_TYPE;
    // YouTubeDataApi(動画一覧)のクエリキー(type)
    private static readonly QUERYKEY_TYPE: string = ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_TYPE;
    // YouTubeDataApi(動画一覧)のtype
    private static readonly YOUTUBE_DATA_API_TYPE: string = ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_TYPE;


    private constructor(response: YouTubeDataApiVideoListResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youTubeDataApiVideoListRequest: YouTubeDataApiVideoListRequestType) {

        const apiUrl = this.getUrl(youTubeDataApiVideoListRequest);

        try {
            // YouTube Data Apiを呼び出す
            const response: YouTubeDataApiVideoListResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeVideoListApi(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画一覧)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }


    /**
     * YouTube Data Api(動画リスト)のエンドポイント
     * @param youtubeDataApiKeyword 
     * @returns 
     */
    private static getUrl(youTubeDataApiVideoListRequest: YouTubeDataApiVideoListRequestType) {

        const apiPathModel = new YouTubeDataApiBasePathModel();

        if (!this.API_RESOURCE) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のリソースが存在しません。");
        }

        if (!this.QUERYKEY_KEYWORD) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(キーワード)が存在しません。");
        }

        if (!this.QUERYKEY_MAXRESULTS) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(最大取得件数)が存在しません。");
        }

        if (!this.YOUTUBE_DATA_API_MAXRESULTS) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)の最大取得件数が存在しません。");
        }

        if (!this.QUERYKEY_PART) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(part)が存在しません。");
        }

        if (!this.YOUTUBE_DATA_API_PART) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のpartが存在しません。");
        }

        if (!this.QUERYKEY_API_KEY) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(APIキー)が存在しません。");
        }

        if (!this.YOUTUBE_DATA_API_API_KEY) {
            throw Error(".envにYouTubeDataApiのAPIキーが存在しません。");
        }

        if (!this.QUERYKEY_TYPE) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(type)が存在しません。");
        }

        if (!this.YOUTUBE_DATA_API_TYPE) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のtypeが存在しません。");
        }

        const apiBaseUrl = `${apiPathModel.basePath}${this.API_RESOURCE}`;

        // クエリパラメータを作成
        const queryParam = this.createQuery(youTubeDataApiVideoListRequest);
        return `${apiBaseUrl}${queryParam ? `?${queryParam}` : ``}`;
    }

    /**
     * api用のクエリパラメータを作成する
     * @param googleBookInfoApisKeyword 
     * @returns 
     */
    private static createQuery(youTubeDataApiVideoListRequest: YouTubeDataApiVideoListRequestType) {

        // 検索キーワード
        const searchKeyWordValue = youTubeDataApiVideoListRequest.youTubeDataApiKeyword;

        if (!this.YOUTUBE_DATA_API_API_KEY) {
            throw Error("設定ファイルにYouTubeDataApiのAPIキーが存在しません。");
        }

        // クエリパラメータ作成用オブジェクト
        const queryBuilder: QueryBuilder = new QueryBuilder(this.QUERYKEY_MAXRESULTS, this.YOUTUBE_DATA_API_MAXRESULTS);
        queryBuilder.add(this.QUERYKEY_KEYWORD, searchKeyWordValue);
        queryBuilder.add(this.QUERYKEY_API_KEY, this.YOUTUBE_DATA_API_API_KEY);
        queryBuilder.add(this.QUERYKEY_PART, this.YOUTUBE_DATA_API_PART);
        queryBuilder.add(this.QUERYKEY_TYPE, this.YOUTUBE_DATA_API_TYPE);

        // 動画種別
        const videoType = youTubeDataApiVideoListRequest.videoType;

        if (videoType) {
            queryBuilder.add(this.QUERYKEY_EVENT_TYPE_KEY, videoType);
        }

        // クエリパラメータを作成
        return queryBuilder.createParam();
    }
}