import { envConfig } from '../../../../util/const/EnvConfig';
import { ApiClient } from '../../../../util/service/ApiClient';
import { QueryBuilder } from '../../../../util/service/QueryBuilder';
import { YouTubeDataApiBasePathModel } from '../../common/model/YouTubeDataApiBasePathModel';
import { YouTubeDataApiPlaylistResponseType } from '../type/YouTubeDataApiPlaylistResponseType';
import { YouTubeDataApiPlaylistEndPointModel } from './YouTubeDataApiPlaylistEndPointModel';


export class YouTubeDataApiPlaylistModel {

    // api通信用クラス
    private static readonly _apiClient: ApiClient = new ApiClient();
    // YouTube Data Apiのプレイリストのレスポンス
    private readonly _response: YouTubeDataApiPlaylistResponseType;


    private constructor(response: YouTubeDataApiPlaylistResponseType) {

        this._response = response;
    }

    get response() {
        return this._response;
    }

    /**
     * YouTube Data Apiを呼び出す
     */
    static async call(youTubeDataApiPlaylistEndPointModel: YouTubeDataApiPlaylistEndPointModel) {

        const apiUrl = youTubeDataApiPlaylistEndPointModel.endpoint;

        try {
            // YouTube Data Apiを呼び出す
            const response: YouTubeDataApiPlaylistResponseType = await this._apiClient.get(apiUrl);
            return new YouTubeDataApiPlaylistModel(response);
        } catch (err) {

            const errorDetails = {
                message: `YouTube Data Api(プレイリスト)の呼び出しでエラーが発生しました。`,
                url: apiUrl,
                error: err
            };

            throw Error(JSON.stringify(errorDetails));
        }
    }
}