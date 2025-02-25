import ENV from '../../../../env.json';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiPath } from '../../common/model/YouTubeDataApiPath';
import { YouTubeDataApiVideoListResponseType } from '../model/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiKeyword } from '../properties/YouTubeDataApiKeyword';


export class YouTubeDataApiVideoList {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画リストのレスポンス
    private readonly _videoList: YouTubeDataApiVideoListResponseType;


    private constructor(videoList: YouTubeDataApiVideoListResponseType) {

        this._videoList = videoList;
    }

    get videoList() {
        return this._videoList;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youtubeDataApiKeyword: YouTubeDataApiKeyword) {

        const apiUrl = this.getUrl(youtubeDataApiKeyword);

        try {
            // YouTube Data Apiを呼び出す
            const response: YouTubeDataApiVideoListResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiVideoList(response);
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
    private static getUrl(youtubeDataApiKeyword: YouTubeDataApiKeyword) {

        const apiPath = new YouTubeDataApiPath();

        if (!ENV.YOUTUBE_DATA_API.LIST.API_RESOURCE) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のリソースが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(キーワード)が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(キーワード)が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_MAXRESULTS) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(最大取得件数)が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_MAXRESULTS) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)の最大取得件数が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.QUERYKEY_APIKEY) {
            throw Error("設定ファイルにYouTubeDataApi(動画一覧)のクエリキー(APIキー)が存在しません。");
        }

        const apiBaseUrl = `${apiPath}${ENV.YOUTUBE_DATA_API.LIST.API_RESOURCE}`;

        // クエリパラメータを作成
        const queryParam = this.createQuery(youtubeDataApiKeyword);
        return `${apiBaseUrl}${queryParam ? `?${queryParam}` : ``}`;
    }

    /**
     * api用のクエリパラメータを作成する
     * @param googleBookInfoApisKeyword 
     * @returns 
     */
    private static createQuery(googleBookInfoApisKeyword: YouTubeDataApiKeyword) {

        // 最大取得件数
        const apiMaxResultKey = `${ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_MAXRESULTS}`;
        const apiMaxResultValue = `${ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_MAXRESULTS}`;
        // 検索キーワード
        const searchKeywordKey = `${ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD}`;
        const searchKeyWordValue = googleBookInfoApisKeyword.keywrod;
        // APIキー
        const apiKey = `${ENV.YOUTUBE_DATA_API.QUERYKEY_APIKEY}`;
        const apiKeyValue = process.env.YOUTUBE_API_KEY;

        if (!apiKeyValue) {
            throw Error("設定ファイルにYouTubeDataApiのAPIキーが存在しません。");
        }

        // クエリパラメータ作成用オブジェクト
        const queryBuilder: QueryBuilder = new QueryBuilder(apiMaxResultKey, apiMaxResultValue);

        // キーワードをクエリパラメータにセット
        const addeKeywordQueryBuilder = queryBuilder.add(searchKeywordKey, searchKeyWordValue);
        const addApiKeyQueryBuilder = addeKeywordQueryBuilder.add(apiKey, apiKeyValue);

        // クエリパラメータを作成
        return addApiKeyQueryBuilder.createParam();
    }
}