import ENV from '../../../../env.json';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YoutubeDataApiVideoListType } from '../model/YoutubeDataApiVideoListType';
import { YoutubeDataApiKeyword } from '../properties/YoutubeDataApiKeyword';


export class YoutubeDataApiVideoList {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YoutubeDataApiの動画リストのレスポンス
    private readonly _videoList: YoutubeDataApiVideoListType[];


    private constructor(videoList: YoutubeDataApiVideoListType[]) {

        this._videoList = videoList;
    }

    get videoList() {
        return this._videoList;
    }

    /**
     * YoutubeDataApiを呼び出す
     */
    static async call(youtubeDataApiKeyword: YoutubeDataApiKeyword) {

        const apiUrl = this.getUrl(youtubeDataApiKeyword);

        try {
            // YoutubeDataApiを呼び出す
            const response: YoutubeDataApiVideoListType[] = await this._apiClient.get(apiUrl);
            return new YoutubeDataApiVideoList(response);
        } catch (err) {

            const errorDetails = {
                message: `YoutubeDataApiの呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }


    private static getUrl(youtubeDataApiKeyword: YoutubeDataApiKeyword) {

        if (!ENV.YOUTUBE_DATA_API.PROTOCOL) {
            throw Error("設定ファイルにプロトコルが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.DOMAIN) {
            throw Error("設定ファイルにYoutubeDataApiのドメインが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.PATH) {
            throw Error("設定ファイルにYoutubeDataApiのパスが存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD) {
            throw Error("設定ファイルにYoutubeDataApiのクエリキー(キーワード)が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_MAXRESULTS) {
            throw Error("設定ファイルにYoutubeDataApiのクエリキー(最大取得件数)が存在しません。");
        }

        if (!ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_MAXRESULTS) {
            throw Error("設定ファイルにYoutubeDataApiの最大取得件数が存在しません。");
        }

        const apiBaseUrl = `${ENV.YOUTUBE_DATA_API.PROTOCOL}${ENV.YOUTUBE_DATA_API.DOMAIN}${ENV.YOUTUBE_DATA_API.PATH}`;

        // クエリパラメータを作成
        const queryParam = this.createQuery(youtubeDataApiKeyword);
        return `${apiBaseUrl}${queryParam ? `?${queryParam}` : ""}`;
    }

    /**
     * api用のクエリパラメータを作成する
     * @param googleBookInfoApisKeyword 
     * @returns 
     */
    private static createQuery(googleBookInfoApisKeyword: YoutubeDataApiKeyword) {

        // 最大取得件数
        const apiMaxResultKey = `${ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_MAXRESULTS}`;
        const apiMaxResultValue = `${ENV.YOUTUBE_DATA_API.LIST.YOUTUBE_DATA_API_MAXRESULTS}`;
        // 検索キーワード
        const searchKeywordKey = `${ENV.YOUTUBE_DATA_API.LIST.QUERYKEY_KEYWORD}`;
        const searchKeyWordValue = googleBookInfoApisKeyword.keywrod;

        // クエリパラメータ作成用オブジェクト
        const queryBuilder: QueryBuilder = new QueryBuilder(apiMaxResultKey, apiMaxResultValue);

        // キーワードをクエリパラメータにセット
        const addeKeywordqueryBuilder = queryBuilder.add(searchKeywordKey, searchKeyWordValue);

        // クエリパラメータを作成
        return addeKeywordqueryBuilder.createParam();
    }
}