import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiVideoListResponseType } from '../type/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiVideoListEndPointModel } from './YouTubeDataApiVideoListEndPointModel';


export class YouTubeDataApiVideoListModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiの動画リストのレスポンス
    private readonly _response: YouTubeDataApiVideoListResponseType;


    private constructor(response: YouTubeDataApiVideoListResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(YouTubeDataApiVideoListEndPointModel: YouTubeDataApiVideoListEndPointModel) {

        const apiUrl = YouTubeDataApiVideoListEndPointModel.endpoint;

        try {
            // YouTube Data Apiを呼び出す
            const response: YouTubeDataApiVideoListResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiVideoListModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(動画一覧)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}